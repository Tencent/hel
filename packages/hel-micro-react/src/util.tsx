import * as React from 'react';
import BuildInSkeleton from './components/BuildInSkeleton';

export function getSkeletonEl(UserSkeleton: any) {
  if (React.isValidElement(UserSkeleton)) {
    return UserSkeleton;
  }
  const SkeletonComp = UserSkeleton || BuildInSkeleton;
  return <SkeletonComp />;
}

export function getSkeletonComp(UserSkeleton: any) {
  if (React.isValidElement(UserSkeleton)) {
    return () => UserSkeleton;
  }
  const SkeletonComp = UserSkeleton || BuildInSkeleton;
  return SkeletonComp;
}
