<template>
    <section class="reports-view">
        <div class="gradient"></div>
        <div class="header">
            <Menu/>
            <h2>Suas Denúncias</h2>
        </div>
        <div class="content">
            <div class="reports-list">
                <div class="report-item" v-for="report in reports" :key="report.id" @click="$router.push({ name: 'report', params: { id: report.id } })">
                    <div class="report-icon">
                        <img :src="report.icon" alt="Ícone da denúncia" />
                    </div>
                    <div class="info-wrap">
                        <div class="info">
                            <h3>{{ report.Type }}</h3>
                            <span class="date">{{ new Date(report.created_at).toLocaleDateString('pt-BR') }}</span>
                        </div>
                        <p>{{ truncatedText(report.Description, 100, '...') }}</p>
                    </div>
                </div>
            </div>
            <div class="empty-state" v-if="reports.length === 0">
                <h3>Nenhuma denúncia registrada</h3>
                <p>Você ainda não fez nenhuma denúncia.</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { supabase } from '@/lib/supabaseClient';

import dangerIcon from '@/assets/images/icons/danger.png'
import femenineIcon from '@/assets/images/icons/femenine.png'
import robberIcon from '@/assets/images/icons/robber.png'
import accidentIcon from '@/assets/images/icons/accident.png'
import disasterIcon from '@/assets/images/icons/disaster.png'
import pawprintIcon from '@/assets/images/icons/pawprint.png'
import defaultIcon from '@/assets/images/icons/alarm.png';

const userStore = useUserStore();
const reports = ref([]);

const reportIcons = {
    'Incêndio': dangerIcon,
    'Violência doméstica': femenineIcon,
    'Assalto': robberIcon,
    'Acidente de trânsito': accidentIcon,
    'Árvore caída': disasterIcon,
    'Animal perdido': pawprintIcon
};

const fetchReports = async () => {
    const { data, error } = await supabase
        .from('Reports')
        .select('*')
        .eq('User_id', userStore.user.id)
        .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      reports.value = [];
    } else {
      reports.value = Array.isArray(data) ? data : [];
      addReportIcons();
    }
};

const addReportIcons = () => {
    reports.value.forEach(report => {
        report.icon = reportIcons[report.Type] || defaultIcon;
    });
};

const truncatedText = (string, letters, end = '') => {
	return string.substring(0, letters) + end
}

onMounted(() => {
    fetchReports();
});
</script>

<style lang="scss" scoped>
.reports-view {

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

        .reports-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .report-item {
                background-color: var(--white-color);
                padding: 20px;
                border-radius: 10px;
                box-shadow: var(--shadow);
                display: flex;
                align-items: center;
                justify-content: flex-start;
                position: relative;
                transition: var(--transition);

                &:hover {
                    transform: scale(1.02);
                }

                .report-icon {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20px;
                    opacity: 0.5;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }

                .info-wrap {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .info {
                        width: 100%;

                        h3 {
                            color: var(--report-color);
                            font-size: var(--subtitle-medium);
                            border-bottom: 1px solid var(--border-color);
                            padding-bottom: 5px; 
                        }

                        .date {
                            position: absolute;
                            right: 10px;
                            top: 10px;
                            color: var(--gray-color);
                            font-size: var(--text-small);
                        }
                    }

                    p {
                        color: var(--gray-color);
                        font-size: var(--text-big);
                        margin-top: 5px;
                    }
                }
            }
        }

        .empty-state {
            text-align: center;
            color: var(--gray-color);
        }
    }
}
</style>