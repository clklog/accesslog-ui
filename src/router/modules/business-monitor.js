import Layout from '@/layout'
const businessRouter = {
    path: '/business',
    component:Layout,
    alwaysShow: true,
    meta: {
      title: '业务监控',
      icon: 'userBehavior'
    },
    children: [
      {  
        path: 'monitorPanel',
        component: () => import('@/views/business-mointor/monitor-panel/index.vue'),
        name: 'monitorPanel',
        meta: { title:'监控面板' }
      },
      {  
        path: 'railwayTrack',
        component: () => import('@/views/business-mointor/railway-track/index.vue'),
        name: 'railwayTrack',
        meta: { title:'链路追踪' }
      },
      {
        path: 'globalTopology',
        component: () => import('@/views/business-mointor/global-topology/index.vue'),
        name: 'globalTopology',
        meta: { title:'全局拓扑分析' }
      },
    ]
  }
  export default businessRouter