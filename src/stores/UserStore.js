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
        Zip_code: '',
        Street: '',
        Number: '',
        District: '',
        City: '',
        State: '',
  	});


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
                    name: customUser.Name,
                    email: customUser.Email,
                    street: customUser.Street || '',
                    number: customUser.Number || '',
                    district: customUser.District || '',
                    city: customUser.City || '',
                    state: customUser.State || '',
                    zip_code: customUser.Zip_code || ''
                });
                logged.value = true;
                saveUserToLocalStorage();

                router.push({ name: 'dashboard' });
            }
        } catch (error) {
            console.error('Login falhou:', error);
            throw error;
        }
    }

    const register = async (email, password) => {
        try {
            if (!email || !password) {
                throw new Error('Erro de validação. Verifique os campos e tente novamente.');
            }

            console.log(email.value, password.value);

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
                    Zip_code: user.Zip_code,
                    Street : user.Street,
                    Number : user.Number,
                    District : user.District,
                    City : user.City,
                    State : user.State,
                    id: data.user.id,
                    Email: data.user.email,
                };

                console.log(userData);

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

    return {
        logged,
        user,
        loadUserFromLocalStorage,
        saveUserToLocalStorage,
        clearLocalStorage,
        login,
        register
    };
})