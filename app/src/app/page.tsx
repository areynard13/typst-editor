import { loadProject } from "@/app/dashboard/actions"
import Editor from "../components/Editor"
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  const { projectId } = await searchParams;
  let projectData = { id:-1, title: "", content: "", fileTree: { children: {}} };

  if (projectId) {
    const project = await loadProject(parseInt(projectId));
    console.log(project)
    if (project) {
      projectData = {
        id: project.id,
        title: project.title,
        content: project.content || "",
        fileTree: (project.fileTree && typeof project.fileTree === 'object' && 'children' in project.fileTree)
          ? (project.fileTree as { children: Record<string, any> })
          : { children: {} },
      };
    } else {
      redirect('/dashboard');
    }
  } else {
    redirect('/dashboard');
  }

  return (
    <Editor 
      projectId={projectData.id}
      title={projectData.title}
      content={projectData.content}
      fileTree={projectData.fileTree}
    />
  );
}