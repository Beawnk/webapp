<template>
  <section class="report-view">
        <div class="gradient"></div>
        <div class="header">
          <Menu />
          <h2>{{ report.Type }}</h2>
        </div>    
        <div class="content">
          <div class="info">
            <h3>Detalhes da Denúncia</h3>
            <p><strong>Data:</strong> {{ new Date(report.created_at).toLocaleDateString('pt-BR') }}</p>
            <div class="details">
                <div class="info-wrap">
                    <h4>Descrição</h4>
                    <p>{{ report.Description }}</p>
                </div>
                <div class="info-wrap">
                    <h4>Tipo de Local</h4>
                    <p>{{ report.Local_type }}</p>
                </div>
            </div>
          </div>
          <div class="report-images" v-if="report.Images && report.Images.length > 0">
            <h3>Imagens</h3>
            <div class="images">
              <img v-for="(image, index) in report.Images" :key="index" :src="image" alt="Imagem da denúncia" />
            </div>
          </div>
            <div class="report-location">
                <h3>Localização</h3>
                <p v-if="report.Zip_code"><strong>CEP:</strong> {{ report.Zip_code }}</p>
                <p><strong>Rua:</strong> {{ report.Street }}</p>
                <p><strong>Número:</strong> {{ report.Number }}</p>
                <p><strong>Bairro:</strong> {{ report.District }}</p>
                <p><strong>Cidade:</strong> {{ report.City }}</p>
                <p><strong>Estado:</strong> {{ report.State }}</p>
            </div>
            <div class="btn-flex">
                <button class="btn danger" @click.prevent="deleteReport">Excluir</button>
                <button class="btn secondary back-btn" @click="$router.go(-1)">Voltar</button>
            </div>
        </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient'; 
import { useRouter } from 'vue-router';

const report = ref({});
const router = useRouter();

const props = defineProps(['id']);

const fetchReport = async () => {
    const { data, error } = await supabase
        .from('Reports')
        .select('*')
        .eq('id', props.id)
        .single();

    if (error) {
        console.error('Erro ao buscar denúncia:', error);
    } else {
        report.value = data;
    }
};

const deleteReport = async () => {
    const { error } = await supabase
        .from('Reports')
        .delete()
        .eq('id', props.id);

    if (error) {
        console.error('Erro ao excluir denúncia:', error);
    } else {
        alert('Denúncia excluída com sucesso!');
        router.push('/reports');
    }
};

onMounted(async () => {
    await fetchReport();
});
</script>

<style lang="scss" scoped>
.report-view {

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
        padding: 50px var(--side);   
        padding-bottom: 0;  
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 17vh;
        z-index: 1;
        position: relative;
        justify-content: center;

        h2 {
            color: var(--text-color);
        }
    }

    .content {
        padding: var(--side);

        .info {
            margin-bottom: 20px;

            h3 {
                font-size: var(--subtitle-big);
                color: var(--report-color);
            }

            p {
                color: var(--gray-color);
                font-size: var(--subtitle-small);
            }

            .details {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 20px;

                .info-wrap {
                    background-color: var(--white-color);
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: var(--shadow);

                    h4 {
                        font-size: var(--subtitle-medium);
                        color: var(--gray-color);
                    }
                    p {
                        color: var(--gray-color);
                        font-size: var(--subtitle-small);
                    }
                }
            }
        }

        .report-images {
            margin-bottom: 20px;

            h3 {
                font-size: var(--subtitle-medium);
                color: var(--report-color);
                margin-bottom: 10px;
            }

            .images {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;

                img {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: var(--shadow);
                }
            }
        }

        .report-location {
            margin-bottom: 20px;

            h3 {
                font-size: var(--subtitle-medium);
                color: var(--report-color);
                margin-bottom: 10px;
            }

            p {
                color: var(--gray-color);
                font-size: var(--subtitle-small);
                margin: 5px 0;
            }
        }

        .btn-flex {
            display: flex;
            justify-content: space-between;
            flex-direction: row-reverse;

            .btn {

                &.danger {
                    background-color: var(--error-color);
                    border-color: var(--error-color);
                    color: var(--white-color);
                }

                &.secondary {
                    border-color: var(--btn-report-color);
                    color: var(--btn-report-color);
                    background-image: url('@/assets/images/icons/back-icon-blue.png');
                }

                &:hover {
                    opacity: 0.9;
                }
            }
        }
    }
}
</style>