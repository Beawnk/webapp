import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { useAlertStore } from '@/stores/alertStore';

export const useUserStore = defineStore('user', () => {
    const route = useRoute();
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

            if (error) {
                alertStore.addGlobalError('Email ou senha inválidos.');
                throw error;
            }

            if (data.user) {
                const { data: customUser, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', data.user.id)
                .single();

                if (userError) {
                    alertStore.addGlobalError('Erro ao carregar informações do usuário.');
                    throw userError;
                }

                Object.assign(user, {
                    id: customUser.id,
                    Name: customUser.Name,
                    Email: customUser.Email,
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
            }
        } catch (error) {
            alertStore.addGlobalError('Erro ao efetuar login', error.message);
            throw error;
        }
    }

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

            if (error) {
                alertStore.addGlobalError('Erro ao criar conta.', authError);
                throw error;
            }

            if (data.user) {
                const userData = {
                    Name: user.Name,
                    Birthdate: user.Birthdate,
                    Phone: user.Phone,
                    Zip_code: user.Zip_code,
                    Street : user.Street,
                    Number : user.Number,
                    District : user.District,
                    City : user.City,
                    State : user.State,
                    id: data.user.id,
                    Email: data.user.email,
                };

                const { error: insertError } = await supabase
                    .from('Users')
                    .insert([userData]);

                if (insertError) {
                    alertStore.addGlobalError('Erro ao salvar informações do usuário.', insertError.message);
                    throw insertError;
                }

                await login(email, password);

                alertStore.addGlobalSuccess('Conta criada com sucesso.');
            }
        } catch (error) {
            alertStore.addGlobalError('Erro ao criar conta.', error.message);
            throw error;
        }
    }

    const updateUser = async () => {
        alertStore.clearNotifications();
        try {
            const { data: session } = await supabase.auth.getSession();

			if (!session) {
				alertStore.addGlobalError('Sessão expirada. Faça login novamente.');
			  	throw new Error('Sessão expirada. Faça login novamente.');
			}

            const { email: currentEmail } = await supabase.auth.getUser();
		  	if (user.Email !== currentEmail) {
				const { error: authError } = await supabase.auth.updateUser({
			  	email: user.Email,
				});
	  
				if (authError) {
			  		alertStore.addGlobalError('Erro ao atualizar email de autenticação.', authError.message);
					throw new Error(`Error updating auth email: ${authError.message}`);
				}
		  	}

            const { error } = await supabase
                .from('Users')
                .update({
                    Name: user.Name,
                    Phone: user.Phone,
                    Zip_code: user.Zip_code,
                    Street: user.Street,
                    Number: user.Number,
                    District: user.District,
                    City: user.City,
                    State: user.State
                })
                .eq('id', user.id);

            if (error) {
                alertStore.addGlobalError('Erro ao atualizar informações do usuário.', error.message);
                throw error;
            }

            alertStore.addGlobalSuccess('Informações do usuário atualizadas com sucesso.');

            saveUserToLocalStorage();
        } catch (error) {
            alertStore.addGlobalError('Erro ao atualizar informações do usuário.', error.message);
            throw error;
        }
    }

    const logout = async () => {
        alertStore.clearNotifications();
        try {
            const { error } = await supabase.auth.signOut();
            if (error && error.name !== 'AuthSessionMissingError') {
                alertStore.addGlobalError('Erro ao efetuar logout.');
                throw error;
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
            alertStore.addGlobalError('Erro ao efetuar logout:', error.message);
            throw error;
        }
    }

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
})