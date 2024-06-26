import { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  createRow,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  darken,
  lighten,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

import { fakeData } from './makeData.ts';

const axiosPrivate = axios.create({
  baseURL: 'http://136.244.95.57:2700/api',
  headers: { 'Content-Type': 'application/json' },
});



const Example = () => {
  const [creatingRowIndex, setCreatingRowIndex] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'bitrix_id',
        header: 'Bitrix ID',
        muiEditTextFieldProps: {
          required: false,
          error: !!validationErrors?.bitrix_id,
          helperText: validationErrors?.bitrix_id,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              bitrix_id: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'name',
        header: 'Название',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'weight',
        header: 'Вес',
        muiEditTextFieldProps: {
          required: false,
          error: !!validationErrors?.weight,
          helperText: validationErrors?.weight,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              weight: undefined,
            }),
        },
      },
      {
        accessorKey: 'time1',
        header: 'Время #1',
        muiEditTextFieldProps: {
          required: false,
          error: !!validationErrors?.time1,
          helperText: validationErrors?.time1,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              time1: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      
      {
        accessorKey: 'time2',
        header: 'Время #2',
        muiEditTextFieldProps: {
          required: false,
          error: !!validationErrors?.time2,
          helperText: validationErrors?.time2,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              time2: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'prep',
        header: 'Подготовка',
        muiEditTextFieldProps: {
          required: false,
          error: !!validationErrors?.prep,
          helperText: validationErrors?.prep,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              prep: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createRecipe, isPending: isCreatingRecipe } =
    useCreateRecipe();
  //call READ hook
  const {
    data: fetchedRecipes = [],
    isError: isLoadingRecipeError,
    isFetching: isFetchingRecipe,
    isLoading: isLoadingRecipe,
    error: loadingError
  } = useGetRecipes();

  // Now you can use fetchedRecipes, isLoadingRecipeError, isFetchingRecipe, isLoadingRecipe, and loadingError as before in your component

  //call UPDATE hook
  const { mutateAsync: updateRecipe, isPending: isUpdatingRecipe } =
    useUpdateRecipe();
  //call DELETE hook
  const { mutateAsync: deleteRecipe, isPending: isDeletingRecipe } =
    useDeleteRecipe();

  //CREATE action
  const handleCreateRecipe = async ({ values, row, table }) => {
    const newValidationErrors = validateRecipe(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createRecipe({ ...values, managerId: row.original.managerId });
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveRecipe = async ({ values, table }) => {
    const newValidationErrors = validateRecipe(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateRecipe(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Вы уверены, что хотите удалить этот рецепт изделия?')) {
      deleteRecipe(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedRecipes,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'modal', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableColumnPinning: true,
    enableEditing: true,
    enableExpanding: true,
    positionCreatingRow: creatingRowIndex, //index where new row is inserted before
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingRecipeError
      ? {
          color: 'error',
          children: `Error loading data: ${loadingError}`,
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      //conditional styling based on row depth
      sx: (theme) => ({
        backgroundColor: darken(
          lighten(theme.palette.background.paper, 0.1),
          row.depth * (theme.palette.mode === 'dark' ? 0.2 : 0.1),
        ),
      }),
    }),
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateRecipe,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveRecipe,
    renderRowActions: ({ row, staticRowIndex, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Внести изменения">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Добавить составляющий ингридиент">
          <IconButton
            onClick={() => {
              setCreatingRowIndex((staticRowIndex || 0) + 1);
              table.setCreatingRow(
                createRow(
                  table,
                  {
                    id: null,
                    firstName: '',
                    lastName: '',
                    city: '',
                    state: '',
                    managerId: row.id,
                    subRows: [],
                  },
                  -1,
                  row.depth + 1,
                ),
              );
            }}
          >
            <PersonAddAltIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        startIcon={<PersonAddAltIcon />}
        variant="contained"
        onClick={() => {
          setCreatingRowIndex(table.getRowModel().rows.length); //create new row at bottom of table
          table.setCreatingRow(true);
        }}
      >
        Добавить рецепт изделия
      </Button>
    ),
    initialState: {
      columnPinning: { left: ['mrt-row-actions'], right: [] },
      expanded: true,
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    state: {
      isLoading: isLoadingRecipe,
      isSaving: isCreatingRecipe || isUpdatingRecipe || isDeletingRecipe,
      showAlertBanner: isLoadingRecipeError,
      showProgressBars: isFetchingRecipe,
    },
  });

  return <MaterialReactTable table={table} />;
};


// CRUD OPERATIONS //

// Helper function to find a recipe in the recipe tree
function findRecipeInTree(recipeId, recipes) {
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].id === recipeId) {
      return recipes[i];
    }
    if (recipes[i].subRows) {
      const found = findRecipeInTree(recipeId, recipes[i].subRows);
      if (found) return found;
    }
  }
  return null;
}

// CREATE hook (add a new recipe)
function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipe) => {
      console.info('create recipe', recipe);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      return Promise.resolve();
    },
    onMutate: (newRecipeInfo) => {
      queryClient.setQueryData(['recipes'], (prevRecipes) => {
        const prevRecipesCopy = JSON.parse(JSON.stringify(prevRecipes));
        if (newRecipeInfo.parentId) {
          const parent = findRecipeInTree(newRecipeInfo.parentId, prevRecipesCopy);
          if (parent) {
            parent.subRows = [...(parent.subRows || []), { ...newRecipeInfo, id: `${parent.id}.${(parent.subRows?.length || 0) + 1}` }];
          }
        } else {
          prevRecipesCopy.push({ ...newRecipeInfo, id: `${prevRecipesCopy.length + 1}` });
        }
        return [...prevRecipesCopy];
      });
    },
  });
}

// READ hook (fetch all recipes)
function useGetRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

// UPDATE hook (update a recipe)
function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipe) => {
      console.info('update recipe', recipe);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      return Promise.resolve();
    },
    onMutate: (updatedRecipeInfo) => {
      queryClient.setQueryData(['recipes'], (prevRecipes) => {
        let recipe = findRecipeInTree(updatedRecipeInfo.id, prevRecipes);
        recipe = { ...recipe, ...updatedRecipeInfo };
        return [...prevRecipes];
      });
    },
  });
}

// DELETE hook (remove a recipe)
function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recipeId) => {
      console.info('delete recipe', recipeId);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      return Promise.resolve();
    },
    onMutate: (recipeId) => {
      queryClient.setQueryData(['recipes'], (prevRecipes) => {
        const newRecipes = JSON.parse(JSON.stringify(prevRecipes));
        const recipe = findRecipeInTree(recipeId, newRecipes);
        if (recipe) {
          const parent = findRecipeInTree(recipe.parentId, newRecipes);
          if (parent) {
            parent.subRows = parent.subRows.filter((subRecipe) => subRecipe.id !== recipeId);
          } else {
            return newRecipes.filter((r) => r.id !== recipeId);
          }
        }
        return [...newRecipes];
      });
    },
  });
}



const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;

function validateRecipe(recipe) {
  const errors = {};
  if (!recipe.name) {
    errors.name = 'Имя обязательно';
  }
  return errors;
}

// function findUserInTree(managerId, users) {
//   for (let i = 0; i < users.length; i++) {
//     if (users[i].id === managerId) {
//       return users[i];
//     }
//     if (users[i].subRows) {
//       const found = findUserInTree(managerId, users[i].subRows);
//       if (found) return found;
//     }
//   }
//   return null;
// }