import { revalidateTag } from "next/cache";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@amaxa/db";
import { project_tracker, User } from "@amaxa/db/schema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  usersNotInProject: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: User.id,
        name: User.name,
      })
      .from(User);
  }),
  joinProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        permission: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, permission, userId } = input;
      if (
        !(
          ctx.session.user.role == "Admin" ||
          ctx.session.user.project_permissions?.[input.projectId] == "admin" ||
          ctx.session.user.project_permissions?.[input.projectId] == "coach"
        )
      ) {
        throw new TRPCError({
          message: "You do not have permissions to update user permissions",
          code: "UNAUTHORIZED",
        });
      }
      const p = permission as "admin" | "coach" | "student";

      revalidateTag("getUserProjects");

      await ctx.db.insert(project_tracker).values({
        userId,
        projectId,
        permission: p,
      });
    }),

  findUsersForProject: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: User.id,
          name: User.name,
          image: User.image,
          email: User.email,
          role: project_tracker.permission,
        })
        .from(project_tracker)
        .where(eq(project_tracker.projectId, input.projectId))
        .innerJoin(User, eq(User.id, project_tracker.userId));
    }),
  updateProjectStatus: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        permission: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, projectId, permission } = input;

      return await ctx.db
        .update(project_tracker)
        .set({
          permission: permission as "admin" | "coach" | "student",
        })
        .where(
          and(
            eq(project_tracker.userId, userId),
            eq(project_tracker.projectId, projectId),
          ),
        );
    }),
});
