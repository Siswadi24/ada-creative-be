import type { UseFetchOptions } from "#app";

export function useApi<T = unknown>(request: string | Ref<string>, options: UseFetchOptions<T>) {
    // const toast = useToast();
    const session = useSession();
    return useFetch(request, {
        onRequest({ options }) {
            if (session.token) {
                options.headers.set("Authorization", `Bearer ${session.token}`);
            }
        },
        onResponseError({ response }) {
            // ✅ Kalau ada message dari backend, tampilkan toast & lemparkan error ke composable caller
            if (response?._data?.message) {
                // Tampilkan toast kalau mau
                // toast.add({
                //     color: "error",
                //     title: response._data.message,
                // });

                // LEMPAR ulang supaya error.value di useSubmit terisi dengan isi body asli
                throw createError({
                    statusCode: response.status,
                    statusMessage: response._data.message,
                    data: response._data,
                });
            }
        },
        retry: false,
        ...options,
    });
}