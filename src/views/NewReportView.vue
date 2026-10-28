<template>
  <section class="new-report-view">
    <div class="gradient"></div>
    <div class="header">
        <AppMenu/>
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
                    <input id="zip-code" v-model="zip_code" type="text" placeholder="Digite o CEP" @input="fillCep" @blur="validateField('cep')">
                    <FieldNotifications field="cep"/>
                </div>
                <div class="input-flex">
                    <div class="input-group street">
                        <label for="street">Rua</label>
                        <input id="street" v-model="street" type="text" placeholder="Digite a rua" @blur="validateField('street')">
                        <FieldNotifications field="street"/>
                    </div>
                    <div class="input-group number">
                        <label for="number">Número</label>
                        <input id="number" v-model="number" type="text" placeholder="Número" @blur="validateField('number')">
                        <FieldNotifications field="number"/>
                    </div>
                </div>
                <div class="input-group">
                    <label for="district">Bairro</label>
                    <input id="district" v-model="district" type="text" placeholder="Digite o bairro" @blur="validateField('district')">
                    <FieldNotifications field="district"/>
                </div>
                <div class="input-group">
                    <label for="city">Cidade</label>
                    <input id="city" v-model="city" type="text" placeholder="Digite a cidade" @blur="validateField('city')">
                    <FieldNotifications field="city"/>
                </div>
                <div class="input-group">
                    <label for="state">Estado</label>
                    <input id="state" v-model="state" type="text" placeholder="Digite o estado" @blur="validateField('state')">
                    <FieldNotifications field="state"/>
                </div>
                <div class="input-group">
                    <label id="local-type-label">Tipo de local</label>
                    <CustomSelect
v-model="localType" aria-labelledby="local-type-label"
                      :options="[
                        { label: 'Residencial', value: 'Residencial' },
                        { label: 'Comercial', value: 'Comercial' },
                        { label: 'Público', value: 'Público' },
                        { label: 'Outro', value: 'Outro' }
                      ]"
                      label="Selecione"
                      @blur="validateField('localType')"
                    />
                    <FieldNotifications field="localType"/>
                </div>
                <div class="input-group">
                    <label for="description">Descrição</label>
                    <textarea id="description" v-model="description" placeholder="Descreva o que está acontecendo:" @blur="validateField('description')"></textarea>
                    <FieldNotifications :field="'description'" />
                </div>
                <div class="input-group">
                    <label for="images">Imagens (opcional)</label>
					<div class="images">
						<div
							v-for="(image, index) in images"
							:key="image.preview"
							class="image"
							@mouseover="imgHoverIndex = index"
							@mouseleave="imgHoverIndex = null"
						>
							<img :src="image.preview" :alt="`Imagem anexada ${index + 1}`" />
							<button
								type="button"
								class="remove"
								:aria-label="`Remover imagem ${index + 1}`"
								@click.prevent="removeImage(index)"
							></button>
						</div>
						<div v-show="images.length < 3" class="input-image">
							<input
								id="images"
								type="file"
								accept="image/png, image/jpeg"
								multiple
								@change="onFileChange"
							/>
						</div>
					</div>
                    <FieldNotifications field="images"/>
                </div>
                <div class="btn-flex">
                    <button type="submit" class="btn primary" :disabled="submitting">{{ submitting ? 'Enviando...' : 'Enviar' }}</button>
                    <button type="button" class="btn secondary back-btn" @click="goBack">Voltar</button>
                </div>
            </form>
        </div>
    </div>
  </section>
</template>

<script setup>
import { useGoBack } from '@/composables/goBack';
import { ref, onBeforeUnmount } from 'vue';
import { useHandleImages } from '@/composables/handleImages';
import { useCepAutofill } from '@/composables/cepAutofill';
import { useUserStore } from '@/stores/UserStore';
import { useForm, useField } from 'vee-validate';
import { supabase } from '@/lib/supabaseClient';
import { uploadReportImages, removeReportImages } from '@/lib/reportImages';
import { useAlertStore } from '@/stores/alertStore';
import { useRouter } from 'vue-router';
import CustomSelect from '@/components/CustomSelect.vue'
import * as yup from 'yup';

// Report type label from /new-report/:type (validated in the router)
const props = defineProps({
  type: { type: String, required: true }
})

const userStore = useUserStore();
const alertStore = useAlertStore();
const router = useRouter();

const imgHoverIndex = ref(null);

const reportSchema = yup.object({
    cep: yup
    .string()
    .nullable()
    .notRequired()
    .transform((value) => (value ? value.replace(/\D/g, '') : value))
    .test('valid-cep', 'CEP deve conter 8 dígitos', (value) => {
      if (!value) return true; 
      return /^\d{8}$/.test(value); 
    }),
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
// Outside vee-validate: it clones form values, and these hold File objects.
// [{ file, preview }], uploaded to Storage only when the report is sent
const images = ref([]);
const submitting = ref(false);

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
  
const { fillCep } = useCepAutofill(
  { zipCode: zip_code, street, district, city, state },
  validateField
);

const onFileChange = (e) => {
	images.value = useHandleImages(images.value, e);
};

const removeImage = (index) => {
	URL.revokeObjectURL(images.value[index].preview);
	images.value.splice(index, 1);
};

// Object URLs keep the file in memory until revoked
onBeforeUnmount(() => {
	images.value.forEach((image) => URL.revokeObjectURL(image.preview));
});

const submitReport = handleSubmit(async (values) => {
    alertStore.clearNotifications();
    submitting.value = true;
    let imagePaths = [];

    try {
        imagePaths = await uploadReportImages(
          userStore.user.id,
          images.value.map((image) => image.file)
        );
    } catch (error) {
        console.error('Erro ao enviar imagens:', error);
        alertStore.addGlobalError('Erro ao enviar as imagens. Tente novamente.');
        submitting.value = false;
        return;
    }

    const reportData = {
      Type: props.type,
      User_id: userStore.user.id,
      Zip_code: values.cep,
      Street: values.street,
      Number: values.number,
      District: values.district,
      City: values.city,
      State: values.state,
      Local_type: values.localType,
      Description: values.description,
      Images: imagePaths
    };

    try {
        const { error } = await supabase
          .from('Reports')
          .insert([reportData]);

        if (error) throw error;

        alertStore.addGlobalSuccess('Denúncia enviada com sucesso.');
        router.push('/reports');
    } catch (error) {
        console.error('Erro ao enviar denúncia:', error);
        // The report wasn't saved, so its images would be orphans
        await removeReportImages(imagePaths);
        alertStore.addGlobalError('Erro ao enviar denúncia. Tente novamente mais tarde.');
    } finally {
        submitting.value = false;
    }
});

const goBack = useGoBack({ name: 'dashboard' });
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