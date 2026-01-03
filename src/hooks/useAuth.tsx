import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';

import { AuthAPI } from '@/api/auth';
import type { Authentication, SignInRequest, SignUpRequest } from '@/types/auth';
import { toast } from './use-toast';

export const INITIAL_AUTHENTICATION_VALUE: Authentication = {
  token: '',
  refreshToken: '',
  user: null,
};

export const authAtom = atomWithStorage<Authentication>(
  'authentication',
  INITIAL_AUTHENTICATION_VALUE,
  undefined,
  { getOnInit: true }
);

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authentication, setAuthentication] = useAtom(authAtom);

  const reset = () => {
    setAuthentication(INITIAL_AUTHENTICATION_VALUE);
    queryClient.clear();
  };

  const signInMutation = useMutation<
    Authentication,
    any,
    SignInRequest
  >({
    mutationFn: AuthAPI.login,
    onSuccess: (data) => {
      setAuthentication(data);
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error?.response?.data?.message ?? 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  const signUpMutation = useMutation<
  Authentication,
  any,
  SignUpRequest
>({
  mutationFn: AuthAPI.register,
  onSuccess: (data) => {
    setAuthentication(data);
    navigate('/');
  },
  onError: (error) => {
    toast({
      title: 'Signup failed',
      description:
        error?.response?.data?.message ??
        error?.message ??
        'Unable to create account',
      variant: 'destructive',
    });
  },
});


  const signout = () => {
    reset();
    navigate('/login');
  };

  return {
    authentication,
    user: authentication.user,
    isLoggedIn: Boolean(authentication.token),

    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,

    isSignInPending: signInMutation.isPending,
    isSignUpPending: signUpMutation.isPending,

    signout,
  };
};
