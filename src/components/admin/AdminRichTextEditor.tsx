"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, FieldError, Label } from "@heroui/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import { useTranslation } from "@/common/i18n/useTranslation";
import { adminUploadImage } from "@/common/api/admin";
import { parseApiError, resolvePublicUploadUrl } from "@/common/utils";
import { toast } from "@/common/utils/toast";

type Props = {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  uploadToken?: string | null;
};

export function AdminRichTextEditor({ label, value, onChange, onBlur, error, placeholder, uploadToken }: Props) {
  const { t, locale } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || t("admin.writeContent") }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  async function onImagePick(file: File) {
    if (!uploadToken) return toast.error(t("admin.notAuthenticated"));
    try {
      const { path } = await adminUploadImage(uploadToken, file);
      const url = resolvePublicUploadUrl(path);
      editor?.chain().focus().setImage({ src: url || path }).run();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.uploadFailed"));
    }
  }

  if (!mounted || !editor) return null;

  return (
    <div className={`rich-text-editor rounded-xl ring-1 ${error ? "ring-danger" : "ring-border/50"}`}>
      {label && <Label className="px-3 pt-3 text-sm font-semibold">{label}</Label>}
      <div className="rich-text-toolbar">
        <Button size="sm" variant="ghost" aria-label={t("admin.bold")} onPress={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-4" />
        </Button>
        <Button size="sm" variant="ghost" aria-label={t("admin.italic")} onPress={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-4" />
        </Button>
        <Button size="sm" variant="ghost" aria-label={t("admin.bulletList")} onPress={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="size-4" />
        </Button>
        <Button size="sm" variant="ghost" aria-label={t("admin.numberedList")} onPress={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label={t("admin.addLink")}
          onPress={() => {
            const url = window.prompt(t("admin.fieldUrl"));
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          <LinkIcon className="size-4" />
        </Button>
        {uploadToken && (
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImagePick(f);
              e.target.value = "";
            }} />
            <Button size="sm" variant="ghost" aria-label={t("admin.addImage")} onPress={() => fileRef.current?.click()}>{t("admin.addImage")}</Button>
          </>
        )}
      </div>
      <div onBlur={() => onBlur?.()}>
        <EditorContent editor={editor} />
      </div>
      {error ? <FieldError className="px-3 pb-3">{error}</FieldError> : null}
    </div>
  );
}
