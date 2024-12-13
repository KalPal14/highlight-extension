import {
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Button,
	Box,
	Text,
	useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { IGetPagesRoItem, IUpdatePageRo } from '~libs/ro/highlight-extension';
import { UpdatePageDto } from '~libs/dto/highlight-extension';
import {
	AccordionForm,
	TextField,
	ConfirmationModal,
	useExceptionHandler,
	toastSuccessOptions,
} from '~libs/react-core';

import { usePages } from '~/highlight-extension-fe/entities/page';

import { IChangePageUrlForm } from '../types/change-page-url-form.interface';

export interface IPageItemProps {
	page: IGetPagesRoItem;
	onUpdatePage: (page: IUpdatePageRo) => void;
}

export function PageItem({ page, onUpdatePage }: IPageItemProps): JSX.Element {
	const { updatePage } = usePages().actions;
	const { toastException } = useExceptionHandler();

	const toast = useToast(toastSuccessOptions);
	const formControls = useForm<IChangePageUrlForm>();
	const {
		register,
		formState: { errors },
		setError,
	} = formControls;

	const [pageToMerge, setPageToMerge] = useState<UpdatePageDto | null>();

	async function updatePageHandler(
		formValues: UpdatePageDto,
		merge: boolean | (() => void)
	): Promise<boolean> {
		try {
			const updatedPage = await updatePage(page, formValues, merge);
			if (!updatedPage) return false;

			onUpdatePage(updatedPage);
			toast({ title: 'Page url has been successfully changed' });
			return true;
		} catch (err) {
			toastException(err, { onValidation: setError });
			return false;
		}
	}

	async function mergePage(): Promise<boolean> {
		if (!pageToMerge) return false;
		const isSuccess = await updatePageHandler(pageToMerge, true);
		setPageToMerge(null);
		return isSuccess;
	}

	async function onSubmit(formValues: IChangePageUrlForm): Promise<boolean> {
		return await updatePageHandler(formValues, () => setPageToMerge(formValues));
	}

	return (
		<>
			<AccordionItem key={page.id}>
				<h2>
					<AccordionButton>
						<Box
							as="span"
							flex="1"
							textAlign="left"
						>
							{page.url}
						</Box>
						<AccordionIcon />
					</AccordionButton>
				</h2>
				<AccordionPanel pb={4}>
					<div>
						<AccordionForm
							formControls={formControls}
							onSubmitHandler={onSubmit}
							accordionButtonText={page.url}
							labelText="Update page url"
						>
							<>
								<TextField
									register={register}
									validationOptions={{
										validate(url) {
											if (url.trim() === page.url)
												return 'The new URL cannot be the same as the current one';
										},
									}}
									errors={errors.url}
									name="url"
									placeholder="Please enter a new page url"
									helperText="This field is intended for manual updating only if the address of the page with your highlights has been changed by the page owner"
								/>
							</>
						</AccordionForm>
					</div>
					<Text fontSize="1rem">
						<span className="options_text-highlighted">{page.highlightsCount}</span> highlights
					</Text>
					<Text fontSize="1rem">
						<span className="options_text-highlighted">{page.notesCount}</span> notes
					</Text>
					<Button
						onClick={() => window.open(page.url)}
						colorScheme="teal"
						mt={5}
					>
						Go to page
					</Button>
				</AccordionPanel>
			</AccordionItem>
			<ConfirmationModal
				isOpen={Boolean(pageToMerge)}
				onConfirm={mergePage}
				onCansel={() => setPageToMerge(null)}
				header="Merge Confirmation"
				body="The page with this URL already exists. We can merge these pages together."
				confirmBtnText="Merge"
			/>
		</>
	);
}
