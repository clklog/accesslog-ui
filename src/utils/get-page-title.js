import defaultSettings from '@/settings'

const title = defaultSettings.title || '国拍日志分析系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title}- ${pageTitle} `
  }
  return `${title}`
}
