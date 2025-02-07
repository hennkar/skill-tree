import { session } from '@/libs/neo4j';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { source, target } = await req.json();
    if (!source || !target) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 },
      );
    }

    await session.run(
      'MATCH (a:Technology), (b:Technology) WHERE ID(a) = $source AND ID(b) = $target CREATE (a)-[r:RELATIONSHIP]->(b) RETURN r',
      { source: Number(source), target: Number(target) },
    );

    return NextResponse.json(
      { message: 'Relationship created' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { fromId, toId } = await req.json();
    if (!fromId || !toId) {
      return NextResponse.json(
        { error: 'Missing fromId or toId' },
        { status: 400 },
      );
    }

    await session.run(
      'MATCH (a)-[r]->(b) WHERE ID(a) = $fromId AND ID(b) = $toId DELETE r',
      { fromId: Number(fromId), toId: Number(toId) },
    );

    return NextResponse.json(
      { message: 'Relationship deleted' },
      { status: 204 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
