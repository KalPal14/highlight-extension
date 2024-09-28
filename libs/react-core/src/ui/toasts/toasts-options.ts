import { UseToastOptions } from '@chakra-ui/react';

export const toastDefOptions: UseToastOptions = {
	duration: 4000,
	isClosable: true,
	status: 'error',
	position: 'top',
};

export const toastSuccessOptions: UseToastOptions = {
	...toastDefOptions,
	status: 'success',
};
