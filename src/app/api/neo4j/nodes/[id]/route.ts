import { session } from '@/libs/neo4j';
import { NextResponse } from 'next/server';

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await session.run(
      'MATCH (n:Technology) WHERE ID(n) = $id DETACH DELETE n',
      { id: Number(params.id) },
    );
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
