import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

export const useUserStore = defineStore('user', () => {
    const route = useRoute();
  	const router = useRouter();

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
        try {
            if (!email || !password) {
                throw new Error('Erro de validação. Verifique os campos e tente novamente.');
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            if (data.user) {
                const { data: customUser, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', data.user.id)
                .single();

                if (userError) {
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
            }
        } catch (error) {
            throw error;
        }
    }

    const register = async (email, password) => {
        try {
            if (!email || !password) {
                throw new Error('Erro de validação. Verifique os campos e tente novamente.');
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                console.error('Erro ao criar conta:1', error);
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
                    throw insertError;
                }

                await login(email, password);
            }
        } catch (error) {
            console.error('Erro ao criar conta.2', error);
            throw error;
        }
    }

    const updateUser = async () => {
        try {
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
                throw error;
            }

            window.alert('Dados atualizados com sucesso!');

            saveUserToLocalStorage();
        } catch (error) {
            window.alert('Erro ao atualizar os dados. Tente novamente mais tarde.');
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
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
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
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