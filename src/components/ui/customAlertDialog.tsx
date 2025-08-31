"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const dialogConfig = {
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    glowColor: "shadow-blue-200",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    borderColor: "border-green-200",
    glowColor: "shadow-green-200",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-500",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    borderColor: "border-red-200",
    glowColor: "shadow-red-200",
  },
  confirm: {
    icon: AlertCircle,
    iconColor: "text-amber-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
    borderColor: "border-amber-200",
    glowColor: "shadow-amber-200",
  },
  loading: {
    icon: Loader2,
    iconColor: "text-blue-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    glowColor: "shadow-blue-200",
  },
} as const;

interface ColorScheme {
  header: string;
  icon: string;
  iconBg: string;
  iconRing: string;
  buttonBg: string;
}

type DialogType = "info" | "success" | "error" | "confirm" | "loading";
type ColorSchemeType = "success" | "error" | "info" | "warning" | "neutral";

const colorSchemes: Record<ColorSchemeType, ColorScheme> = {
  success: {
    header: "bg-green-600",
    icon: "bg-green-600",
    iconBg: "bg-green-100",
    iconRing: "border-green-300",
    buttonBg: "bg-green-600 hover:bg-green-700",
  },
  error: {
    header: "bg-red-600",
    icon: "bg-red-600",
    iconBg: "bg-red-100",
    iconRing: "border-red-300",
    buttonBg: "bg-red-600 hover:bg-red-700",
  },
  info: {
    header: "bg-blue-600",
    icon: "bg-blue-600",
    iconBg: "bg-blue-100",
    iconRing: "border-blue-300",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
  },
  warning: {
    header: "bg-amber-500",
    icon: "bg-amber-500",
    iconBg: "bg-amber-100",
    iconRing: "border-amber-300",
    buttonBg: "bg-amber-500 hover:bg-amber-600",
  },
  neutral: {
    header: "bg-gray-600",
    icon: "bg-gray-600",
    iconBg: "bg-gray-100",
    iconRing: "border-gray-300",
    buttonBg: "bg-gray-600 hover:bg-gray-700",
  },
} as const;

const defaultColorSchemeMapping = {
  success: "success" as ColorSchemeType,
  error: "error" as ColorSchemeType,
  info: "info" as ColorSchemeType,
  confirm: "success" as ColorSchemeType,
  loading: "warning" as ColorSchemeType,
} as const;

interface AlertDialogState {
  open: boolean;
  type: DialogType;
  title?: string;
  description?: string;
  confirmLabel?: string;
  inputPlaceholder?: string;
  colorScheme?: ColorScheme | ColorSchemeType;
  resolve?: (value: any) => void;
}

interface AlertDialogActions {
  show: (config: {
    type: DialogType;
    title?: string;
    description?: string;
    confirmLabel?: string;
    inputPlaceholder?: string;
    colorScheme?: ColorScheme | ColorSchemeType;
  }) => Promise<any>;
  close: () => void;
}

/**
 * Hook Zustand untuk mengelola state global dari MyAlertDialog.
 *
 * Digunakan sebagai pengganti alert konvensional (seperti SweetAlert) namun berbasis
 * ShadCN Dialog, React, dan Zustand. Kompatibel dengan berbagai jenis dialog:
 * - success, error, info, confirm, loading
 * - bisa dikonfigurasi dengan label tombol dan input teks
 *
 * @example
 * const confirmed = await useMyAlertDialog.getState().show({ type: "confirm", title: "Yakin?" });
 * useMyAlertDialog.getState().close();
 */
export const useMyAlertDialog = create<AlertDialogState & AlertDialogActions>(
  (set, get) => ({
    /** Status apakah dialog sedang tampil */
    open: false,

    /** Jenis dialog yang ditampilkan (success, error, confirm, dll) */
    type: "info",

    /** Judul dialog */
    title: undefined,

    /** Deskripsi/pesan tambahan */
    description: undefined,

    /** Label tombol konfirmasi (opsional) */
    confirmLabel: undefined,

    /** Placeholder jika dialog membutuhkan input teks */
    inputPlaceholder: undefined,

    /** Skema warna custom untuk dialog (optional) */
    colorScheme: undefined,

    /** Fungsi resolve yang digunakan untuk await hasil (true, false, atau string) */
    resolve: undefined,

    /**
     * Menampilkan dialog dengan konfigurasi yang diberikan.
     * Mengembalikan Promise<boolean|string> yang bisa di-await oleh pemanggil.
     *
     * @param config Konfigurasi dialog yang ditampilkan
     * @returns Promise<boolean|string>
     */
    show: (config) => {
      return new Promise((resolve) => {
        set({
          open: true,
          type: config.type,
          title: config.title,
          description: config.description,
          confirmLabel: config.confirmLabel,
          inputPlaceholder: config.inputPlaceholder,
          colorScheme: config.colorScheme,
          resolve,
        });
      });
    },

    /**
     * Menutup dialog dan mereset state internal ke nilai default.
     */
    close: () => {
      set({
        open: false,
        type: "info",
        title: undefined,
        description: undefined,
        confirmLabel: undefined,
        inputPlaceholder: undefined,
        colorScheme: undefined,
        resolve: undefined,
      });
    },
  })
);

export function MyAlertDialog() {
  const {
    open,
    type,
    title,
    description,
    close,
    resolve,
    confirmLabel,
    inputPlaceholder,
    colorScheme: customColorScheme,
  } = useMyAlertDialog();

  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    resolve?.(inputPlaceholder ? inputValue : true);
    setInputValue("");
    close();
  };

  const handleCancel = () => {
    resolve?.(false);
    setInputValue("");
    close();
  };

  const isConfirm = type === "confirm";
  const config = dialogConfig[type];
  const Icon = config.icon;

  // Get color scheme - priority: custom > default mapping > fallback
  const getColorScheme = (): ColorScheme => {
    // Jika ada custom color scheme
    if (customColorScheme) {
      // Jika berupa string (ColorSchemeType), ambil dari predefined schemes
      if (typeof customColorScheme === "string") {
        return colorSchemes[customColorScheme];
      }
      // Jika berupa object (ColorScheme), gunakan langsung
      return customColorScheme;
    }

    // Fallback ke default mapping berdasarkan type
    const defaultSchemeType = defaultColorSchemeMapping[type] || "neutral";
    return colorSchemes[defaultSchemeType];
  };

  const colorScheme = getColorScheme();

  // Advanced animation variants
  const containerVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 50,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  } as const;

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
      },
    },
  } as const;

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  } as const;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog open={open} onOpenChange={close}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl rounded-2xl [&>button]:hidden">
            <DialogTitle className="hidden">Dialog Custom</DialogTitle>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-2xl overflow-hidden"
              style={{
                perspective: "1000px",
                pointerEvents: "auto",
              }}
            >
              {/* Header Section with Dynamic Color */}
              <motion.div
                className={cn(
                  "px-6 py-4 flex items-center justify-between",
                  colorScheme.header
                )}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              >
                <h2 className="text-white text-lg font-semibold">
                  {title || "Verifikasi Pengajuan"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={close}
                  className="text-white hover:bg-white/20 p-1 h-auto rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Content Section */}
              <div className="p-6">
                {/* Icon and Text Section - Horizontal Layout */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Icon Section with Dynamic Color */}
                  <motion.div
                    variants={iconVariants}
                    className="flex-shrink-0"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.5,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center relative",
                        colorScheme.iconBg
                      )}
                    >
                      {type === "success" || type === "confirm" ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.5,
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              colorScheme.icon
                            )}
                          >
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.7, duration: 0.3 }}
                            >
                              <Check className="w-6 h-6 text-white" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : type === "loading" ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{
                            scale: { delay: 0.5, duration: 0.4 },
                            rotate: {
                              delay: 0.9,
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            },
                          }}
                        >
                          <Loader2
                            className={cn(
                              "w-8 h-8",
                              colorScheme.icon.replace("bg-", "text-")
                            )}
                          />
                        </motion.div>
                      ) : type === "error" ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.5,
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              colorScheme.icon
                            )}
                          >
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.7, duration: 0.3 }}
                            >
                              <X className="w-6 h-6 text-white" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.5,
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center",
                              colorScheme.icon
                            )}
                          >
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.7, duration: 0.3 }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {/* Subtle pulse ring with dynamic color */}
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-full border-2",
                          colorScheme.iconRing
                        )}
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          delay: 0.8,
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Text Content - Next to Icon */}
                  <motion.div
                    variants={textVariants}
                    className="flex-1 pt-2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                  >
                    {description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {description}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Input Field if needed */}
                {inputPlaceholder && (
                  <motion.div
                    variants={textVariants}
                    className="mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <Input
                      placeholder={inputPlaceholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full"
                    />
                  </motion.div>
                )}

                {/* Divider */}
                <motion.div
                  className="border-t border-gray-200 mb-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                />

                {/* Buttons Section with Dynamic Color */}
                {type !== "loading" && (
                  <motion.div
                    className="flex justify-end gap-3"
                    style={{ pointerEvents: "auto" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                  >
                    {isConfirm ? (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ pointerEvents: "auto" }}
                        >
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="px-6 py-2 font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full min-w-[100px] transition-colors duration-200"
                            style={{ pointerEvents: "auto" }}
                          >
                            Batal
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ pointerEvents: "auto" }}
                        >
                          <Button
                            onClick={handleConfirm}
                            className={cn(
                              "px-6 py-2 font-medium text-white rounded-full min-w-[100px] shadow-sm transition-colors duration-200",
                              colorScheme.buttonBg
                            )}
                            style={{ pointerEvents: "auto" }}
                          >
                            {confirmLabel || "Setujui"}
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ pointerEvents: "auto" }}
                      >
                        <Button
                          onClick={handleConfirm}
                          className={cn(
                            "px-8 py-2 font-medium rounded-full min-w-[120px] shadow-sm transition-colors duration-200 text-white",
                            colorScheme.buttonBg
                          )}
                          style={{ pointerEvents: "auto" }}
                        >
                          {confirmLabel || "OK"}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
