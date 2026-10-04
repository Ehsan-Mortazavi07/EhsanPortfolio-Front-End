"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import type { ReactNode } from "react";
import { useTranslation } from "@/common/i18n/useTranslation";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export function AdminConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  confirmLabel,
  isPending = false,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const state = useOverlayState({ isOpen, onOpenChange });

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={!isPending} className="bg-black/65 backdrop-blur-sm">
        <Modal.Container size="sm" placement="center">
          <Modal.Dialog className="admin-confirm-dialog">
            <Modal.Header>
              <Modal.Heading>{title}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="text-sm leading-7 text-foreground/75">{message}</Modal.Body>
            <Modal.Footer className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" isDisabled={isPending} onPress={() => onOpenChange(false)}>
                {t("admin.cancel")}
              </Button>
              <Button variant="danger" isPending={isPending} onPress={onConfirm}>
                {confirmLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
