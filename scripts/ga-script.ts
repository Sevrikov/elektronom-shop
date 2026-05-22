import { AnalyticsAdminServiceClient } from '@google-analytics/admin'

const client = new AnalyticsAdminServiceClient({
  keyFilename: 'ga4-key.json',
})

const propertyId = '360046623'
const parent = `properties/${propertyId}`

async function run() {
  try {
    console.log('Fetching Data Streams...')
    const [streams] = await client.listDataStreams({ parent })
    const webStream = streams.find((s) => s.type === 'WEB_DATA_STREAM')

    if (webStream) {
      console.log('Found Web Stream:', webStream.name)

      const enhancedSettingsName = `${webStream.name}/enhancedMeasurementSettings`
      const [settings] = await client.getEnhancedMeasurementSettings({ name: enhancedSettingsName })

      console.log('Current Enhanced Measurement (before):', JSON.stringify(settings))

      settings.pageViewsEnabled = true
      settings.scrollsEnabled = true
      settings.outboundClicksEnabled = true
      settings.siteSearchEnabled = true
      settings.videoEngagementEnabled = true
      settings.fileDownloadsEnabled = true
      settings.formInteractionsEnabled = true

      await client.updateEnhancedMeasurementSettings({
        enhancedMeasurementSettings: settings,
        updateMask: {
          paths: [
            'page_views_enabled',
            'scrolls_enabled',
            'outbound_clicks_enabled',
            'site_search_enabled',
            'video_engagement_enabled',
            'file_downloads_enabled',
            'form_interactions_enabled',
          ],
        },
      })
      console.log('Enhanced Measurement fully enabled!')
    }

    console.log('Fetching Attribution Settings...')
    const attributionName = `${parent}/attributionSettings`
    const [attrSettings] = await client.getAttributionSettings({ name: attributionName })
    console.log('Current Attribution Settings (before):', JSON.stringify(attrSettings))

    attrSettings.reportingAttributionModel = 'CROSS_CHANNEL_DATA_DRIVEN'
    await client.updateAttributionSettings({
      attributionSettings: attrSettings,
      updateMask: { paths: ['reporting_attribution_model'] },
    })
    console.log('Attribution set to CROSS_CHANNEL_DATA_DRIVEN!')

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('API Error:', message)
  }
}

run()
