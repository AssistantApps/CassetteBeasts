import type { IExternalResource } from 'contracts/externalResource';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { IVersion } from 'contracts/version';
import { getCleanedString } from 'helpers/stringHelper';
import { getConfig } from 'services/internal/configService';

export const VersionMapFromDetailList = (props: {
  resourceMap: Record<string, string>;
  externalResourcesMap: Record<number, IExternalResource>;
  subAnimationResourceMap: Record<number, ISubAnimationResource>;
}): IVersion => {
  return {
    commit_tag: getCleanedString(props.resourceMap['commit_tag']),
    commit_sha: getCleanedString(props.resourceMap['commit_sha']),
    app_version: getConfig().packageVersion(),
  };
};
