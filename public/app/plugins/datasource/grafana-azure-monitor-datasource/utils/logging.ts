import { config, reportInteraction } from '@grafana/runtime';

import { AzureMonitorQuery, AzureQueryType } from '../types';

export const logAzureMonitorEvent = (target: AzureMonitorQuery, dashboardId: string, eventName: string) => {
  let typeSpecific;
  switch (target.queryType) {
    case AzureQueryType.AzureMonitor:
      typeSpecific = {
        dimensions: target.azureMonitor?.dimensionFilters?.length ?? 0,
        alias: !!target.azureMonitor?.alias,
        top: !!target.azureMonitor?.top,
      };
      break;
    case AzureQueryType.LogAnalytics:
      typeSpecific = {
        complexity: target.azureLogAnalytics?.query?.match(/\|/g)?.length,
        format: target.azureLogAnalytics?.resultFormat,
      };
      break;

    case AzureQueryType.AzureResourceGraph:
      typeSpecific = {
        complexity: target.azureResourceGraph?.query?.match(/\|/g)?.length,
      };
      break;
  }

  const event = {
    dashboard_id: dashboardId,
    datasource: target.datasource?.type,
    grafana_version: config.buildInfo.version,
    // plugin_version: not sure how to get the datasource version - maybe we can get it from joining with another bigquery table?
    hidden: target.hide,
    query_type: target.queryType,
    ...typeSpecific,
  };

  console.log(event);
  reportInteraction(eventName, event);
};
