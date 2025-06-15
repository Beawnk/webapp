<template>
  <section class="new-report-view">
    <div class="gradient"></div>
    <div class="header">
        <Menu/>
        <h2>Denunciar</h2>
    </div>
    <div class="content">
        <div class="info">
            <h3>{{ props.type }}</h3>
        </div>
        <div class="report-form">
            <form @submit.prevent="submitReport">
                <div class="input-group">
                    <label for="zip-code">CEP (opcional)</label>
                    <input type="text" id="zip-code" placeholder="Digite o CEP" v-model="zip_code" @keyup="fillCep" @blur="validateField('cep')">
                    <FieldNotifications field="cep"/>
                </div>
                <div class="input-flex">
                    <div class="input-group street">
                        <label for="street">Rua</label>
                        <input type="text" id="street" placeholder="Digite a rua" v-model="street" @blur="validateField('street')">
                        <FieldNotifications field="street"/>
                    </div>
                    <div class="input-group number">
                        <label for="number">Número</label>
                        <input type="text" id="number" placeholder="Número" v-model="number" @blur="validateField('number')">
                        <FieldNotifications field="number"/>
                    </div>
                </div>
                <div class="input-group">
                    <label for="district">Bairro</label>
                    <input type="text" id="district" placeholder="Digite o bairro" v-model="district" @blur="validateField('district')">
                    <FieldNotifications field="district"/>
                </div>
                <div class="input-group">
                    <label for="city">Cidade</label>
                    <input type="text" id="city" placeholder="Digite a cidade" v-model="city" @blur="validateField('city')">
                    <FieldNotifications field="city"/>
                </div>
                <div class="input-group">
                    <label for="state">Estado</label>
                    <input type="text" id="state" placeholder="Digite o estado" v-model="state" @blur="validateField('state')">
                    <FieldNotifications field="state"/>
                </div>
                <div class="input-group">
                    <label for="local-type">Tipo de local</label>
                    <CustomSelect @blur="validateField('localType')"
                      v-model="localType"
                      :options="[
                        { label: 'Residencial', value: 'Residencial' },
                        { label: 'Comercial', value: 'Comercial' },
                        { label: 'Público', value: 'Público' },
                        { label: 'Outro', value: 'Outro' }
                      ]"
                      label="Selecione"
                    />
                    <FieldNotifications field="localType"/>
                </div>
                <div class="input-group">
                    <label for="description">Descrição</label>
                    <textarea id="description" placeholder="Descreva o que está acontecendo:" v-model="description" @blur="validateField('description')"></textarea>
                    <FieldNotifications :field="'description'" />
                </div>
                <div class="input-group">
                    <label for="images">Imagens (opcional)</label>
					<div class="images">
						<div
							class="image"
							v-for="(image, index) in images"
							:key="index"
							@mouseover="imgHoverIndex = index"
							@mouseleave="imgHoverIndex = null"
						>
							<img :src="image" alt="Imagem do produto" />
							<button
								class="remove"
								@click.prevent="removeImage(index)"
							></button>
						</div>
						<div class="input-image" v-show="images.length < 3">
							<input
								type="file"
								id="image"
								@change="onFileChange"
								multiple
							/>
						</div>
					</div>
                    <FieldNotifications field="images"/>
                </div>
                <div class="btn-flex">
                    <button type="submit" class="btn primary">Enviar</button>
                    <button class="btn secondary back-btn" @click.prevent="$router.go(-1)">Voltar</button>
                </div>
            </form>
        </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useHandleImages } from '@/composables/handleImages';
import { useGetAddress } from '@/composables/getAddress';
import { useUserStore } from '@/stores/UserStore';
import { useForm, useField } from 'vee-validate';
import { supabase } from '@/lib/supabaseClient';
import { useAlertStore } from '@/stores/alertStore';
import { useRouter } from 'vue-router';
import Menu from '@/components/Menu.vue';
import CustomSelect from '@/components/CustomSelect.vue'
import * as yup from 'yup';

const props = defineProps(['type'])

const userStore = useUserStore();
const alertStore = useAlertStore();
const router = useRouter();

const imgHoverIndex = ref(null);

const reportSchema = yup.object({
    cep: yup
      .string()
      .transform((value) => value.replace(/\D/g, ''))
      .matches(/^\d{8}$/, 'CEP deve conter 8 dígitos'),
    street: yup.string().required('Digite a rua'),
    number: yup.string().required('Digite o número'),
    district: yup.string().required('Digite o bairro'),
    city: yup.string().required('Digite a cidade'),
    state: yup.string().required('Digite o estado'),
    localType: yup.string().required('Selecione o tipo de local'),
    description: yup.string().required('Digite a descrição')
        .min(10, 'A descrição deve ter pelo menos 10 caracteres')
        .max(800, 'A descrição não pode ter mais de 800 caracteres')
});

const { handleSubmit } = useForm({
  validationSchema: reportSchema,
  validateOnMount: false,
  initialValues: {
    cep: '',
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    description: '',
    localType: '',
    images: [],
  },
});

const { value: zip_code, validate: validateCep } = useField('cep', undefined, {
  validateOnValueUpdate: false
});
const { value: street, validate: validateStreet } = useField('street', undefined, {
  validateOnValueUpdate: false
});
const { value: number, validate: validateNumber } = useField('number', undefined, {
  validateOnValueUpdate: false
});
const { value: district, validate: validateDistrict } = useField('district', undefined, {
  validateOnValueUpdate: false
});
const { value: city, validate: validateCity } = useField('city', undefined, {
  validateOnValueUpdate: false
});
const { value: state, validate: validateState } = useField('state', undefined, {
  validateOnValueUpdate: false
});
const { value: description, validate: validateDescription } = useField('description', undefined, {
  validateOnValueUpdate: false
});
const { value: localType, validate: validateLocalType } = useField('localType', undefined, {
  validateOnValueUpdate: false
});
const { value: images } = useField('images', undefined, {
	validateOnValueUpdate: false
});

const validateField = (fieldName) => {
  const validateMap = {
    cep: validateCep,
    street: validateStreet,
    number: validateNumber,
    district: validateDistrict,
    city: validateCity,
    state: validateState,
    description: validateDescription,
    localType: validateLocalType
};
  
  if (validateMap[fieldName]) {
    validateMap[fieldName]();
  }
};
  
const fillCep = async () => {
  const cepValue = zip_code.value.replace(/\D/g, '');
  if (cepValue.length == 8) {
    const address = await useGetAddress(cepValue);
    street.value = address.logradouro;
    district.value = address.bairro;
    city.value = address.localidade;
    state.value = address.uf;

    validateField('street');
    validateField('district');
    validateField('city');
    validateField('state');
  }
};

const onFileChange = async (e) => {
	images.value = await useHandleImages(images.value, e);
};

const removeImage = (index) => {
	images.value.splice(index, 1);
};

const submitReport = handleSubmit(async (values) => {
    alertStore.clearNotifications();

    const reportData = {
      Type: props.type,
      User_id: userStore.user.id,
      Zip_code: values.zip_code,
      Street: values.street,
      Number: values.number,
      District: values.district,
      City: values.city,
      State: values.state,
      Local_type: values.localType,
      Description: values.description,
      Images: values.images
    };

    try {
        const { data, error } = await supabase
          .from('Reports')
          .insert([reportData]);

        if (error) throw error;

        alertStore.addGlobalSuccess('Denúncia enviada com sucesso.');
        router.push('/reports');
    } catch (error) {
        console.error('Erro ao enviar denúncia:', error);
        alertStore.addGlobalError('Erro ao enviar denúncia. Tente novamente mais tarde.');
    }
});
</script>

<style lang="scss" scoped>
.new-report-view {

    .gradient {
        background: var(--report-gradient-color);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: var(--gradient-border-width);
        height: 17vh;
        border-radius: var(--gradient-border-radius);
        box-shadow: 0px 0px 14px 7px var(--shadow-color);
    }

    .header {
        padding: 70px var(--side);
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 17vh;
        z-index: 1;
        position: relative;
    
        h2 {
            font-size: var(--title-small);
            color: var(--text-color);
        }
    }

    .content {
        padding: var(--side);

        .info {
            margin-bottom: 20px;

            h3 {
                font-size: var(--subtitle-medium);
                color: var(--gray-color);
            }
        }

        .report-form {
            form {
                display: flex;
                flex-direction: column;

                input, textarea {

                    &:focus {
                        border-color: var(--report-color);
                    }
                }

                .street {
                  width: 80%;
                }

                .number {
                  width: 20%;
                }

                .images {
		        	display: flex;
		        	background-color: var(--white-color);
		        	border-radius: 10px;
		        	overflow: hidden;
		        	padding: 10px;
		        	gap: 10px;
                    border: 1px solid var(--border-color);

		        	.image {
		        		position: relative;
		        		border-radius: 10px;
		        		width: 100px;
		        		height: 100px;
		        		img {
		        			width: 100%;
		        			height: 100%;
		        			object-fit: cover;
		        			border-radius: 10px;
		        		}
		        		.remove {
		        			position: absolute;
		        			top: -8px;
		        			right: -8px;
		        			width: 25px;
		        			height: 25px;
		        			background-color: var(--error-color);
		        			border-radius: 5px;
		        			background-image: url('@/assets/images/icons/clear-white.png');
		        			background-size: 10px;
		        			background-repeat: no-repeat;
		        			background-position: center;
		        		}
		        	}
		        	.input-image {
		        		position: relative;
		        		width: 100px;
		        		height: 100px;
		        		overflow: hidden;
		        		border-radius: 10px;
		        		background-color: #55555536;	
		        		&::before {
		        			content: '+';
		        			position: absolute;
		        			top: 50%;
		        			left: 50%;
		        			transform: translate(-50%, -50%);
		        			font-size: 30px;
		        			color: var(--text-color);
		        			opacity: 0.5;
		        		}
		        		input {
		        			opacity: 0;
		        			position: absolute;
		        			top: 0;
		        			left: 0;
		        			width: 100%;
		        			height: 100%;
		        			cursor: pointer;
		        		}
		        	}
		        }
                .btn-flex {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row-reverse;

                    .btn {
                        border-color: var(--btn-report-color);

                        &.primary {
                            background-color: var(--btn-report-color);
                            color: var(--white-color);
                        }

                        &.secondary {
                            color: var(--btn-report-color);
                            background-image: url('@/assets/images/icons/back-icon-blue.png');
                        }
                    }
                }
            }
        }
    }
}
</style>