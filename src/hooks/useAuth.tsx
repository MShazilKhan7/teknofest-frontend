import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/auth';
import { Authentication, SignInRequest } from '@/types/auth';
import { toast } from './use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authentication, setAuthentication] = useAtom(authAtom);

  const reset = () => {
    setAuthentication(INITIAL_AUTHENTICATION_VALUE);
    queryClient.clear();
  };

  const { mutate: signIn, isPending: isSignInPending } = useMutation<
    Authentication,
    Error,
    SignInRequest
  >({
    mutationFn: AuthAPI.login,
    onSuccess: (data: Authentication) => {
      setAuthentication({ ...data });
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.data.message,
      });
    },
  });

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: AuthAPI.register,
    onSuccess: (data: Authentication) => {
      setAuthentication({ ...data });
      navigate('/');
    },
  });

  const signout = () => {
    reset();
    navigate('/login');
  };

  return {
    authentication,
    user: authentication.user,
    isLoggedIn: !!authentication.accessToken,

    signIn,
    signUp,
    signout,
    isSignInPending,
    isSignUpPending,
  };
};

export const INITIAL_AUTHENTICATION_VALUE: Authentication = {
  accessToken: '',
  refreshToken: '',
  user: null,
};

export const authAtom = atomWithStorage('authentication', INITIAL_AUTHENTICATION_VALUE, undefined, {
  getOnInit: true,
});
