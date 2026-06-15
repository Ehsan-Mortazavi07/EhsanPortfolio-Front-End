import { AdminServiceForm } from "@/components/admin/AdminServiceForm";
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AdminServiceForm mode="edit" slug={slug} />;
}
