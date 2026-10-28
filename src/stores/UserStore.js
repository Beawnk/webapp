import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useAlertStore } from '@/stores/alertStore';

const emptyUser = () => ({
  id: '',
  Name: '',
  Email: '',
  Birthdate: '',
  Phone: '',
  Zip_code: '',
  Street: '',
  Number: '',
  District: '',
  City: '',
  State: '',
});

// The Supabase session is the only source of truth for "logged in":
// supabase-js persists and refreshes it, so the store just mirrors it
export const useUserStore = defineStore('user', () => {
  const alertStore = useAlertStore();

  const logged = ref(false);
  const user = reactive(emptyUser());

  const firstName = computed(() => (user.Name ? user.Name.split(' ')[0] : 'Usuário'));

  const resetUser = () => {
    Object.assign(user, emptyUser());
    logged.value = false;
  };

  const loadProfile = async (authUser) => {
    const { data: customUser, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) throw new Error('Erro ao carregar informações do usuário.');

    Object.assign(user, {
      id: customUser.id,
      Name: customUser.Name,
      // The auth email is the source of truth: Users.Email can lag
      // behind after an email change is confirmed
      Email: authUser.email,
      Birthdate: customUser.Birthdate || '',
      Phone: customUser.Phone || '',
      Street: customUser.Street || '',
      Number: customUser.Number || '',
      District: customUser.District || '',
      City: customUser.City || '',
      State: customUser.State || '',
      Zip_code: customUser.Zip_code || '',
    });
    logged.value = true;
  };

  const init = async () => {
    // Older versions kept a copy of the profile here
    localStorage.removeItem('user');
    localStorage.removeItem('logged');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) await loadProfile(session.user);
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  };

  // Covers sessions that end outside the app (expired refresh token, logout
  // in another tab). The callback must not await other Supabase calls.
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') resetUser();
  });

  // The router guard awaits this before deciding where the user can go
  const ready = init();

  // Every failure below throws an Error with the message meant for the user,
  // and only the catch shows it, so each failure produces a single toast
  const login = async (email, password) => {
    alertStore.clearNotifications();
    try {
      if (!email || !password) {
        if (!email) alertStore.setFieldError('email', 'Digite seu email.');
        if (!password) alertStore.setFieldError('password', 'Digite sua senha.');
        throw new Error('Erro de validação. Verifique os campos e tente novamente.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error('Email ou senha inválidos.');

      await loadProfile(data.user);
      alertStore.addGlobalSuccess('Login efetuado com sucesso.');
    } catch (error) {
      alertStore.addGlobalError(error.message);
      throw error;
    }
  };

  const register = async (email, password) => {
    alertStore.clearNotifications();
    try {
      if (!email || !password) {
        if (!email) alertStore.setFieldError('email', 'Digite seu email.');
        if (!password) alertStore.setFieldError('password', 'Digite sua senha.');
        throw new Error('Erro de validação. Verifique os campos e tente novamente.');
      }

      // The profile goes in the user metadata and the on_auth_user_created
      // trigger creates the "Users" row (supabase/signup-profile-trigger.sql),
      // so it exists even when signUp returns no session
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            Name: user.Name,
            Birthdate: user.Birthdate,
            Phone: user.Phone,
            Zip_code: user.Zip_code,
            Street: user.Street,
            Number: user.Number,
            District: user.District,
            City: user.City,
            State: user.State,
          },
        },
      });

      if (error || !data.user) throw new Error('Erro ao criar conta.');

      // Email confirmation on: no session until the user clicks the link
      if (!data.session) {
        alertStore.addGlobalSuccess(
          'Conta criada! Confirme pelo link que enviamos para o seu email e depois entre.',
        );
        return false;
      }

      await loadProfile(data.user);
      alertStore.addGlobalSuccess('Conta criada com sucesso.');
      return true;
    } catch (error) {
      alertStore.addGlobalError(error.message);
      throw error;
    }
  };

  const updateUser = async () => {
    alertStore.clearNotifications();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error('Sessão expirada. Faça login novamente.');

      const currentEmail = session.user.email;
      let emailChangeRequested = false;

      if (user.Email !== currentEmail) {
        const { error: authError } = await supabase.auth.updateUser({
          email: user.Email,
        });

        if (authError) throw new Error('Erro ao atualizar email de autenticação.');

        // The new email only takes effect after the user confirms it,
        // so keep showing the current one until then
        user.Email = currentEmail;
        emailChangeRequested = true;
      }

      const { error } = await supabase
        .from('Users')
        .update({
          Name: user.Name,
          Email: currentEmail,
          Phone: user.Phone,
          Zip_code: user.Zip_code,
          Street: user.Street,
          Number: user.Number,
          District: user.District,
          City: user.City,
          State: user.State,
        })
        .eq('id', user.id);

      if (error) throw new Error('Erro ao atualizar informações do usuário.');

      alertStore.addGlobalSuccess('Informações do usuário atualizadas com sucesso.');
      if (emailChangeRequested) {
        alertStore.addGlobalSuccess('Enviamos um link de confirmação para o novo email.');
      }
    } catch (error) {
      alertStore.addGlobalError(error.message);
      throw error;
    }
  };

  // Supabase emails a link to /reset-password that signs the user in
  // (recovery session), where they choose the new password
  const requestPasswordReset = async (email) => {
    alertStore.clearNotifications();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alertStore.addGlobalError('Erro ao enviar o email. Tente novamente em alguns minutos.');
      throw error;
    }
  };

  const updatePassword = async (password) => {
    alertStore.clearNotifications();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Supabase refuses a new password equal to the current one
      const message =
        error.code === 'same_password'
          ? 'A nova senha precisa ser diferente da atual.'
          : 'Erro ao atualizar a senha. Peça um novo link e tente de novo.';
      alertStore.addGlobalError(message);
      throw error;
    }
    alertStore.addGlobalSuccess('Senha atualizada com sucesso.');
  };

  const logout = async () => {
    alertStore.clearNotifications();
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.name !== 'AuthSessionMissingError') {
        throw new Error('Erro ao efetuar logout.');
      }
      resetUser();
      alertStore.addGlobalSuccess('Logout efetuado com sucesso.');
    } catch (error) {
      alertStore.addGlobalError(error.message);
      throw error;
    }
  };

  return {
    logged,
    user,
    firstName,
    ready,
    login,
    register,
    updateUser,
    requestPasswordReset,
    updatePassword,
    logout,
  };
});
