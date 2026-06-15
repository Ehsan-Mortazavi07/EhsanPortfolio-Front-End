import { AdminSkillForm } from "@/components/admin/AdminSkillForm";
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AdminSkillForm mode="edit" slug={slug} />;
}
