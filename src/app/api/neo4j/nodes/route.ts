'use server'

import {session} from '@/libs/neo4j';
import {EdgeProps, SkillTreeNodeNeo} from '@/libs/types';
import {revalidatePath} from "next/cache";

export async function getTechnologies() {
  try {
    const result = await session.run(
        'MATCH (n:Technology) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m'
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

    return { nodes: Array.from(nodesMap.values()), edges };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function createTechnology(name: string, level: number, x: number, y: number): Promise<SkillTreeNodeNeo> {
  try {
    if (!name) {
      throw new Error('Name is required');
    }

    const result = await session.run(
        'CREATE (n:Technology {name: $name, level: $level, x: $x, y:$y}) RETURN n',
        { name, level, x, y }
    );
    const node = result.records[0].get('n');

    revalidatePath('/skill-tree');

    return {
      id: node.identity.toString(),
      data: { label: node.properties.name, level: node.properties.level },
      position: { x: node.properties.x, y: node.properties.y },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}