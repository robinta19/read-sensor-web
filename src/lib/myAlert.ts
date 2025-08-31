import { useMyAlertDialog } from "@/components/ui/customAlertDialog";

/**
 * Global alert utility mirip SweetAlert2, berbasis ShadCN Dialog dan Zustand.
 *
 * ✅ Bisa dipakai untuk:
 * - myAlert.success("Sukses!", "Data berhasil disimpan")
 * - myAlert.error("Gagal", "Terjadi kesalahan saat menghapus")
 * - const confirmed = await myAlert.confirm("Yakin?", "Data akan dihapus")
 * - const note = await myAlert.input("Tulis Alasan", "Kenapa data ini dihapus?")
 * - myAlert.loading("Mengirim data...") untuk menampilkan loading
 * - myAlert.done() untuk menutup loading
 *
 * 🔧 Digunakan lintas proyek untuk notifikasi yang user-friendly.
 */
export const myAlert = {
  /**
   * Menampilkan dialog sukses di tengah layar
   */
  success: (title: string, description?: string) =>
    useMyAlertDialog.getState().show({
      type: "success",
      title,
      description,
    }),

  /**
   * Menampilkan dialog error di tengah layar
   */
  error: (title: string, description?: string) =>
    useMyAlertDialog.getState().show({
      type: "error",
      title,
      description,
    }),

  /**
   * Menampilkan dialog informasi umum
   */
  info: (title: string, description?: string) =>
    useMyAlertDialog.getState().show({
      type: "info",
      title,
      description,
    }),

  /**
   * Menampilkan dialog konfirmasi dengan tombol Ya / Batal
   * @returns Promise<boolean> true jika user klik Ya, false jika batal
   */
  confirm: (
    title: string,
    description?: string,
    confirmLabel = "Ya, Lanjut"
  ): Promise<boolean> =>
    useMyAlertDialog.getState().show({
      type: "confirm",
      title,
      description,
      confirmLabel,
    }),

  /**
   * Menampilkan dialog dengan input teks
   * @returns Promise<string|false> - string jika diisi, false jika batal
   */
  input: (
    title: string,
    description?: string,
    inputPlaceholder = "Tulis sesuatu...",
    confirmLabel = "Kirim"
  ): Promise<string | false> =>
    useMyAlertDialog.getState().show({
      type: "confirm",
      title,
      description,
      inputPlaceholder,
      confirmLabel,
    }),

  /**
   * Menampilkan dialog loading (tanpa tombol interaksi)
   */
  loading: (title = "Memproses...", description = "Mohon tunggu sebentar") =>
    useMyAlertDialog.setState({
      open: true,
      type: "loading",
      title,
      description,
      resolve: undefined, // loading tidak butuh resolve
    }),

  /**
   * Menutup dialog (biasanya setelah loading selesai)
   */
  done: () => useMyAlertDialog.getState().close(),
};
