import prisma from '../lib/prisma.js';

export async function createVacationRequest({
  userId,
  startDate,
  endDate,
  reason,
}) {
  return await prisma.vacationRequest.create({
    data: {
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason?.trim() || null,
    },
  });
}

export async function getVacationRequestById(id) {
  return await prisma.vacationRequest.findUnique({ where: { id } });
}

export async function getMyVacationRequests(userId) {
  return await prisma.vacationRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}

export async function getAllVacationRequests(status) {
  const where = status ? { status } : {};
  return await prisma.vacationRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}

export async function approveVacationRequest(id) {
  return await prisma.vacationRequest.update({
    where: { id },
    data: { status: 'APPROVED', comments: null },
  });
}

export async function rejectVacationRequest(id, comments) {
  return await prisma.vacationRequest.update({
    where: { id },
    data: { status: 'REJECTED', comments: comments?.trim() || null },
  });
}
