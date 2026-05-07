import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const verificationLevelSchema = z.enum(["Unverified", "Contact Verified", "Real Person Verified"]);
const comfortPreferenceSchema = z.enum(["Small groups", "Text-first", "Quiet", "Flexible pace", "Indoor backup"]);
const reportReasonSchema = z.enum(["Safety concern", "Harassment", "Fake profile", "Underage concern", "Spam", "Other"]);

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  profile: router({
    me: publicProcedure.query(() => ({
      displayName: "Alon",
      intent: "Exploring",
      suburb: "Chatswood NSW 2067",
      visibilityPreference: "Blurred",
      comfortPreferences: ["Small groups", "Text-first", "Quiet"],
      verificationLevel: "Contact Verified",
    })),
    update: publicProcedure
      .input(
        z.object({
          displayName: z.string().min(2).max(32).optional(),
          suburb: z.string().min(2).max(80).optional(),
          intent: z.enum(["Friends", "Dating", "Both", "Exploring"]).optional(),
          visibilityPreference: z.enum(["Blurred", "Visible"]).optional(),
          comfortPreferences: z.array(comfortPreferenceSchema).optional(),
          verificationLevel: verificationLevelSchema.optional(),
        })
      )
      .mutation(({ input }) => ({ success: true, profile: input })),
  }),

  events: router({
    list: publicProcedure.query(() => ({ source: "local-prototype", events: [] })),
    join: publicProcedure.input(z.object({ eventId: z.string().min(1) })).mutation(({ input }) => ({
      success: true,
      membership: { eventId: input.eventId, status: "joined", joinedAt: new Date().toISOString() },
    })),
    leave: publicProcedure.input(z.object({ eventId: z.string().min(1) })).mutation(({ input }) => ({
      success: true,
      membership: { eventId: input.eventId, status: "left", leftAt: new Date().toISOString() },
    })),
  }),

  chat: router({
    messages: publicProcedure.input(z.object({ eventId: z.string().min(1) })).query(({ input }) => ({
      eventId: input.eventId,
      messages: [],
    })),
    send: publicProcedure.input(z.object({ eventId: z.string().min(1), text: z.string().min(1).max(1200) })).mutation(({ input }) => ({
      success: true,
      message: { id: crypto.randomUUID(), eventId: input.eventId, text: input.text, createdAt: new Date().toISOString() },
    })),
  }),

  safety: router({
    block: publicProcedure.input(z.object({ userId: z.string().min(1) })).mutation(({ input }) => ({ success: true, blockedUserId: input.userId })),
    report: publicProcedure
      .input(z.object({ eventId: z.string().min(1), reportedUserId: z.string().min(1), reason: reportReasonSchema }))
      .mutation(({ input }) => ({ success: true, report: { ...input, createdAt: new Date().toISOString() } })),
  }),

  feedback: router({
    submit: publicProcedure
      .input(
        z.object({
          eventId: z.string().min(1),
          comfort: z.enum(["Good", "Mixed", "Unsafe"]),
          wouldMeetAgain: z.boolean(),
        })
      )
      .mutation(({ input }) => ({ success: true, feedback: { ...input, createdAt: new Date().toISOString() } })),
  }),
});

export type AppRouter = typeof appRouter;
