import { AdminProjectForm } from "@/components/admin/AdminProjectForm";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AdminProjectForm mode="edit" slug={slug} />;
}
