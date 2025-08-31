import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { myAlert } from "@/lib/myAlert";
import { formatErrorMessages } from "@/lib/utils";

/**
 * Custom error untuk aksi yang dibatalkan oleh user
 */
class UserCancelledError extends Error {
  constructor() {
    super("Action cancelled by user");
    this.name = "UserCancelledError";
  }
}

/**
 * Custom React Query mutation hook untuk form yang otomatis:
 * - Menampilkan loading dialog
 * - Menampilkan pesan sukses
 * - Menangani error validasi dari backend dan mengisi setError react-hook-form jika diberikan
 * - Bisa menyisipkan konfirmasi sebelum mutate (confirm modal)
 *
 * @template TData - Tipe data response dari mutation
 * @template TError - Tipe error dari mutation (biasanya any)
 * @template TVariables - Tipe payload yang dikirim
 * @template TForm - Tipe field form yang digunakan untuk setError
 */

type FormMutationOptions<
  TData,
  TError,
  TVariables,
  TForm extends FieldValues,
> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> & {
  mutationFn: (variables: TVariables) => Promise<TData>;
  loadingMessage?: string;
  successMessage?: string;
  confirmMessage?: {
    title: string;
    description?: string;
  };
  setError?: UseFormSetError<TForm>; // Optional setError dari form
};

export function useFormMutation<
  TData,
  TError = any,
  TVariables = void,
  TForm extends FieldValues = FieldValues,
>(
  options: FormMutationOptions<TData, TError, TVariables, TForm>
): UseMutationResult<TData, TError, TVariables> {
  const {
    mutationFn,
    loadingMessage,
    successMessage,
    confirmMessage,
    setError,
    ...restOptions
  } = options;

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      if (confirmMessage) {
        const confirmed = await myAlert.confirm(
          confirmMessage.title,
          confirmMessage.description
        );
        if (!confirmed) {
          myAlert.done(); // pastikan loading ditutup
          return Promise.reject(new UserCancelledError());
        }
      }
      myAlert.loading(loadingMessage || "Memproses...");
      const result = await mutationFn(variables);
      return result;
    },
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        myAlert.success("Berhasil", successMessage);
        setTimeout(() => {
          myAlert.done();
        }, 3000);
      } else {
        myAlert.done();
      }

      restOptions.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      if (error instanceof UserCancelledError) {
        myAlert.done(); // pastikan loading ditutup jika batal
        return;
      }

      const rawData = error?.data || {};
      myAlert.error(error?.message || "Error", formatErrorMessages(rawData));

      if (setError) {
        Object.entries(rawData).forEach(([field, error]) => {
          if (!error) return;
          const message = Array.isArray(error)
            ? error[0]
            : typeof error === "object" &&
                "_errors" in error &&
                Array.isArray(error._errors)
              ? error._errors[0]
              : "Invalid";

          setError(field as Path<TForm>, {
            type: "server",
            message,
          });
        });
      }

      restOptions.onError?.(error, variables, context);
    },
    ...restOptions,
  });
}
