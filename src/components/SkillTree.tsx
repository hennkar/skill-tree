'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodeEditor from './NodeEditor';
import { SkillTreeNode } from '@/libs/types';

const initialNodes: SkillTreeNode[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1', level: 1 },
    type: 'default',
  },
  {
    id: '2',
    position: { x: 300, y: 200 },
    data: { label: 'Node 2', level: 2 },
    type: 'default',
  },
];

const initialEdges: Edge[] = [];

const SkillTree: React.FC = () => {
  const [nodes, setNodes] = useState<SkillTreeNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const addNode = useCallback(() => {
    setNodes((nds) => {
      const newNode: SkillTreeNode = {
        id: (nds.length + 1).toString(),
        position: { x: 200 + nds.length * 50, y: 100 + nds.length * 50 },
        data: {
          label: `Node ${nds.length + 1}`,
          level: Math.ceil((nds.length + 1) / 5),
        },
        type: 'default',
      };
      return [...nds, newNode];
    });
  }, []);

  /*  const removeNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);*/

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: SkillTreeNode) => {
      setSelectedNode(node);
    },
    [],
  );

  return (
    <div className="w-full h-screen bg-gray-100 p-4 flex">
      <div className="w-3/4 relative">
        <button
          onClick={addNode}
          className="p-2 bg-blue-500 text-white rounded mb-4"
        >
          Add Node
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          defaultViewport={{ x: 1, y: 1, zoom: 1 }}
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      <div className="w-1/4 p-4 bg-white shadow-lg">
        <NodeEditor node={selectedNode} setNodes={setNodes} />
      </div>
    </div>
  );
};

export default SkillTree;
