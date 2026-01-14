'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUserProjects() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("No authorization")

    return await prisma.project.findMany({
        where: { userId: parseInt(session.user.id) },
        orderBy: { id: 'desc' }
    })
}

export async function createProject(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("No authorization")

    const title = formData.get("title") as string

    await prisma.project.create({
        data: {
            title: title,
            userId: parseInt(session.user.id),
            fileTree: {},
        }
    })

    revalidatePath("/dashboard")
}

export async function saveProjectData(projectId: number, content: string, fileTree: any) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    await prisma.project.update({
        where: { id: projectId },
        data: {
            content: content,
            fileTree: fileTree
        }
    })
    revalidatePath("/dashboard")
}
                    
export async function loadProject(id: number) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Non autorisé")

    const project = getProjectById(id, session.user.id)
    return project
}

async function getProjectById(projectId: number, userId: string) {

    return await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: parseInt(userId)
        }
    })
}