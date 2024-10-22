import { useFlags } from 'src/hooks/useFlags';
// import { useAccount } from 'src/queries/account/account';

/**
 * Hook to determine if the IAM feature should be visible to the user.
 * Based on the user's account capability and the feature flag.
 *
 * @returns {boolean} - Whether the IAM feature is enabled for the current user.
 */
export const useIsIAMEnabled = () => {
  // const { data: account } = useAccount();
  const flags = useFlags();

  // what will be the text in the account?.capabilities for iam?
  const isIAMEnabled =
    // account?.capabilities.includes('Managed Databases Beta') &&
    flags.iam?.enabled;

  return {
    isIAMEnabled,
    isIAMBeta: flags.iam?.beta,
  };
};
