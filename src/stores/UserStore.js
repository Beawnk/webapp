import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { useAlertStore } from '@/stores/alertStore';

export const useUserStore = defineStore('user', () => {
    const router = useRouter();
    const alertStore = useAlertStore();

    const logged = ref(false);

    const user = reactive({
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

    const page = ref('');

    const loadUserFromLocalStorage = () => {
        const storedUser = localStorage.getItem('user');
        const isLogged = localStorage.getItem('logged') === 'true';
        if (storedUser && isLogged) {
            Object.assign(user, JSON.parse(storedUser));
            logged.value = true;
        }
    };

    const saveUserToLocalStorage = () => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('logged', logged.value);
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('logged');
    };

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
                password
            });

            if (error) throw new Error('Email ou senha inválidos.');

            const { data: customUser, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (userError) throw new Error('Erro ao carregar informações do usuário.');

            Object.assign(user, {
                id: customUser.id,
                Name: customUser.Name,
                // The auth email is the source of truth: Users.Email can lag
                // behind after an email change is confirmed
                Email: data.user.email,
                Birthdate: customUser.Birthdate || '',
                Phone: customUser.Phone || '',
                Street: customUser.Street || '',
                Number: customUser.Number || '',
                District: customUser.District || '',
                City: customUser.City || '',
                State: customUser.State || '',
                Zip_code: customUser.Zip_code || ''
            });
            logged.value = true;
            saveUserToLocalStorage();

            router.push({ name: 'dashboard' });
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

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error || !data.user) throw new Error('Erro ao criar conta.');

            const userData = {
                Name: user.Name,
                Birthdate: user.Birthdate,
                Phone: user.Phone,
                Zip_code: user.Zip_code,
                Street: user.Street,
                Number: user.Number,
                District: user.District,
                City: user.City,
                State: user.State,
                id: data.user.id,
                Email: data.user.email,
            };

            const { error: insertError } = await supabase
                .from('Users')
                .insert([userData]);

            if (insertError) throw new Error('Erro ao salvar informações do usuário.');
        } catch (error) {
            alertStore.addGlobalError(error.message);
            throw error;
        }

        // Outside the try: login shows its own errors, so catching them here
        // would show a second toast
        await login(email, password);
        alertStore.addGlobalSuccess('Conta criada com sucesso.');
    };

    const updateUser = async () => {
        alertStore.clearNotifications();
        try {
            const { data: { session } } = await supabase.auth.getSession();

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
                    State: user.State
                })
                .eq('id', user.id);

            if (error) throw new Error('Erro ao atualizar informações do usuário.');

            alertStore.addGlobalSuccess('Informações do usuário atualizadas com sucesso.');
            if (emailChangeRequested) {
                alertStore.addGlobalSuccess('Enviamos um link de confirmação para o novo email.');
            }

            saveUserToLocalStorage();
        } catch (error) {
            alertStore.addGlobalError(error.message);
            throw error;
        }
    };

    const logout = async () => {
        alertStore.clearNotifications();
        try {
            const { error } = await supabase.auth.signOut();
            if (error && error.name !== 'AuthSessionMissingError') {
                throw new Error('Erro ao efetuar logout.');
            }
            clearLocalStorage();
            Object.assign(user, {
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
                State: ''
            });
            logged.value = false;
            router.push({ name: 'welcome' });

            alertStore.addGlobalSuccess('Logout efetuado com sucesso.');
        } catch (error) {
            alertStore.addGlobalError(error.message);
            throw error;
        }
    };

    loadUserFromLocalStorage();

    return {
        logged,
        user,
        loadUserFromLocalStorage,
        saveUserToLocalStorage,
        clearLocalStorage,
        login,
        register,
        updateUser,
        logout
    };
});
