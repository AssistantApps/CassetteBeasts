import { IExternalResource } from 'contracts/externalResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { IVersion } from 'contracts/version';
import { getCleanedString } from 'helpers/stringHelper';

export const VersionMapFromDetailList = (props: {
  resourceMap: Record<string, string>;
  externalResourcesMap: Record<number, IExternalResource>;
  subAnimationResourceMap: Record<number, ISubAnimationResource>;
}): IVersion => {
  return {
    commit_tag: getCleanedString(props.resourceMap['commit_tag']),
    commit_sha: getCleanedString(props.resourceMap['commit_sha']),
  };
};
