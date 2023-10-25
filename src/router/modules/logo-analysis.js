import Layout from '@/layout'
const tableRouter = {
    path: '/logAnalysis',
    component:Layout,
    alwaysShow: true,
    meta: {
      title: '日志分析',
      icon: 'behaviorAnaly'
    },
    children: [
      {  
        path: 'dataOverview',
        component: () => import('@/views/log-analysis/data-overview'),
        name: 'dataOverview',
        meta: { title:'数据概览' }
      },
      {
        path: 'performance',
        component: () => import('@/views/log-analysis/performance-analysis'),
        name: 'performance',
        meta: { title:'性能分析' }
      },
      {
        path: 'statuCode',
        component: () => import('@/views/log-analysis/statuCode-analysis'),
        name: 'statuCode',
        meta: { title:'状态码分析' }
      }
    ]
  }
  export default tableRouter