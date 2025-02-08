import {session} from '@/libs/neo4j';
import {NextResponse} from 'next/server';
import {EdgeProps, SkillTreeNodeNeo} from '@/libs/types';

export async function GET() {
  try {
    const result = await session.run(
      'MATCH (n:Technology) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m',
    );

    const nodesMap = new Map<string, SkillTreeNodeNeo>();
    const edges: EdgeProps[] = [];

    result.records.forEach((record) => {
      const node = record.get('n');
      if (node && !nodesMap.has(node.identity.toString())) {
        nodesMap.set(node.identity.toString(), {
          id: node.identity.toString(),
          data: { label: node.properties.name, level: node.properties.level },
          position: { x: node.properties.x, y: node.properties.y },
        });
      }

      const targetNode = record.get('m');
      const edge = record.get('r');
      if (edge && targetNode) {
        edges.push({
          id: edge.identity.toString(),
          source: edge.start.toString(),
          target: edge.end.toString(),
          type: edge.type,
        });
      }
    });

    return NextResponse.json({ nodes: Array.from(nodesMap.values()), edges });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, level, x, y } = await req.json();
    if (!name)
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const result = await session.run(
      'CREATE (n:Technology {name: $name, level: $level, x: $x, y:$y}) RETURN n',
      { name, level, x, y },
    );
    const node = result.records[0].get('n');

    return NextResponse.json(
      {
        id: node.identity.toString(),
        data: { label: node.properties.name, level: node.properties.level },
        position: { x: node.properties.x, y: node.properties.y },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
