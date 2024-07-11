import Layout from '@/layout'
const tableRouter = {
  path: '/logAnalysis',
  component: Layout,
  alwaysShow: true,
  meta: {
    title: '日志分析',
    icon: 'behaviorAnaly'
  },
  children: [
    {
      path: 'dataOverview',
      component: () => import('@/views/log-analysis/data-overview/index.vue'),
      name: 'dataOverview',
      meta: { title: '数据概览' }
    },
    {
      path: 'trend',
      component: () => import('@/views/trend-analysis/index.vue'),
      name: 'trend',
      meta: { title: '趋势分析' }
    },
    {
      path: 'abnormal',
      component: () => import('@/views/log-analysis/abnormal/index.vue'),
      name: 'abnormal',
      meta: { title: '异常分析' }
    },
    {
      path: 'performance',
      component: () => import('@/views/log-analysis/index.vue'),
      name: 'performance',
      redirect: '',
      meta: { title: '性能分析' },
      alwaysShow: true,
      children: [
        {
          path: 'timeConsuming',
          component: () => import('@/views/log-analysis/performance-analysis/timeConsuming.vue'),
          name: 'timeConsuming',
          meta: { title: '页面分析' }
        },
        {
          path: 'timingDiagram',
          component: () => import('@/views/log-analysis/performance-analysis/timingDiagram.vue'),
          name: 'timingDiagram',
          meta: { title: '超100毫秒时序图' }
        },
      ]
    },
    {
      path: 'statuCode',
      component: () => import('@/views/log-analysis/statuCode-analysis/index.vue'),
      name: 'statuCode',
      meta: { title: '状态码分析' }
    },
    {
      path: 'ip',
      component: () => import('@/views/ip-analysis/index.vue'),
      name: 'ip',
      meta: { title: 'IP分析' }
    },
  ]
}
export default tableRouter