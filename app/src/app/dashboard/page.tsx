import Link from "next/link"
import { getUserProjects, createProject } from "./actions"

export default async function Dashboard() {
  const projects = await getUserProjects()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Mes Projets</h1>

      <form action={createProject} className="mb-8 flex gap-2">
        <input 
          name="title" 
          placeholder="Nom du projet" 
          className="border p-2 rounded"
          required 
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Créer un projet
        </button>
      </form>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <p>Aucun projet pour le moment.</p>
        ) : (
          projects.map((project) => (
            <Link
            href={`/?projectId=${project.id}`} 
            key={project.id} 
            className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer block"
            >
                <h3>{project.title}</h3>
                <p className="text-sm text-gray-500">Ouvrir le projet</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}