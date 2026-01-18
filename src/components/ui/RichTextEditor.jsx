import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect } from "react";
import {
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineStrikethrough,
  HiOutlineListBullet,
  HiOutlineLink,
  HiOutlinePhoto,
} from "react-icons/hi2";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuUnderline,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuListOrdered,
  LuQuote,
  LuUndo,
  LuRedo,
  LuCode,
  LuSeparatorHorizontal,
} from "react-icons/lu";

const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-2 rounded-lg transition-all duration-200
      ${
        isActive
          ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
  >
    {children}
  </button>
);

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10 bg-white/5">
      {/* Text formatting */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <HiOutlineBold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <HiOutlineItalic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <LuUnderline className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <HiOutlineStrikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <LuCode className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <LuHeading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <LuHeading3 className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <LuAlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <LuAlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <LuAlignRight className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <HiOutlineListBullet className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <LuListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <LuQuote className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Media & Links */}
      <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
        <MenuButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <HiOutlineLink className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={addImage} title="Add Image">
          <HiOutlinePhoto className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <LuSeparatorHorizontal className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5 pl-2">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <LuUndo className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <LuRedo className="w-4 h-4" />
        </MenuButton>
      </div>
    </div>
  );
};

const RichTextEditor = ({
  content = "",
  onChange,
  placeholder = "Start writing...",
  error,
  label,
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg my-4" },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div
        className={`
          rounded-xl overflow-hidden
          bg-white/5 backdrop-blur-sm
          border transition-colors duration-200
          ${
            error
              ? "border-red-500/50"
              : "border-white/10 focus-within:border-violet-500/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="p-4" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
