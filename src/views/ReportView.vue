<template>
  <section class="report-view">
    <div class="gradient"></div>
    <div class="header">
      <AppMenu />
      <h2>{{ report ? report.Type : 'Denúncia' }}</h2>
    </div>
    <div class="content">
      <p v-if="loading">Carregando denúncia...</p>
      <p v-else-if="!report">Denúncia não encontrada.</p>
      <template v-else>
        <div class="info">
          <h3>Detalhes da Denúncia</h3>
          <p>
            <strong>Data:</strong> {{ new Date(report.created_at).toLocaleDateString('pt-BR') }}
          </p>
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
        <div v-if="imageUrls.length > 0" class="report-images">
          <h3>Imagens</h3>
          <div class="images">
            <img
              v-for="(image, index) in imageUrls"
              :key="index"
              :src="image"
              :alt="`Imagem ${index + 1} da denúncia`"
            />
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
      </template>
      <div class="btn-flex">
        <button
          v-if="report"
          type="button"
          class="btn danger"
          :disabled="deleting"
          @click="deleteReport"
        >
          Excluir
        </button>
        <button type="button" class="btn secondary back-btn" @click="goBack">Voltar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';
import { useAlertStore } from '@/stores/alertStore';
import { getReportImageUrls, removeReportImages } from '@/lib/reportImages';
import { useGoBack } from '@/composables/goBack';

const report = ref(null);
const imageUrls = ref([]);
const loading = ref(true);
const deleting = ref(false);
const router = useRouter();
const alertStore = useAlertStore();
const goBack = useGoBack({ name: 'reports' });

// Route param, always a string
const props = defineProps({
  id: { type: String, required: true },
});

const fetchReport = async () => {
  // maybeSingle: a report that doesn't exist (or isn't the user's, by RLS) is null, not an error
  const { data, error } = await supabase
    .from('Reports')
    .select('*')
    .eq('id', props.id)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar denúncia:', error);
    alertStore.addGlobalError('Erro ao carregar a denúncia.');
  }
  report.value = data;
  loading.value = false;

  // The report text shows first; the images (signed URLs) fill in after
  if (data?.Images?.length) {
    try {
      imageUrls.value = await getReportImageUrls(data.Images);
    } catch (imageError) {
      console.error('Erro ao carregar imagens:', imageError);
      alertStore.addGlobalError('Erro ao carregar as imagens da denúncia.');
    }
  }
};

const deleteReport = async () => {
  if (!window.confirm('Excluir esta denúncia? Essa ação não pode ser desfeita.')) return;

  deleting.value = true;
  // select() returns the deleted rows: RLS makes a delete on someone else's
  // report match nothing instead of failing, so an empty list means not deleted
  const { data, error } = await supabase.from('Reports').delete().eq('id', props.id).select('id');
  deleting.value = false;

  if (error || !data.length) {
    console.error('Erro ao excluir denúncia:', error);
    alertStore.addGlobalError('Não foi possível excluir a denúncia.');
    return;
  }

  await removeReportImages(report.value.Images || []);
  alertStore.addGlobalSuccess('Denúncia excluída com sucesso.');
  router.push({ name: 'reports' });
};

onMounted(fetchReport);
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
