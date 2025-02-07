'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodeEditor from './NodeEditor';

interface SkillTreeNode extends Node {
  data: {
    label: string;
    description?: string;
    level?: number;
  };
}

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
  const [nodes, setNodes] = useState<SkillTreeNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

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

  const addNode = () => {
    const newNode: SkillTreeNode = {
      id: (nodes.length + 1).toString(),
      position: {
        x: (nodes.length % 5) * 200,
        y: Math.floor(nodes.length / 5) * 150,
      },
      data: {
        label: `Node ${nodes.length + 1}`,
        level: Math.ceil((nodes.length + 1) / 5),
      },
      type: 'default',
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  const onNodeClick = (_: React.MouseEvent, node: SkillTreeNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-full h-screen bg-gray-100 p-4 flex">
      <div className="w-3/4">
        <button
          onClick={addNode}
          className="p-2 bg-blue-500 text-white rounded mb-4"
        >
          Add Node
        </button>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            position: {
              x: (node.data.level! - 1) * 200,
              y: (parseInt(node.id) % 5) * 100,
            },
            data: {
              ...node.data,
              label: (
                <div className="relative p-2 bg-white border rounded shadow">
                  <strong>{node.data.label}</strong>
                  <p className="text-xs text-gray-600">
                    {node.data.description}
                  </p>
                  <button
                    onClick={() => removeNode(node.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                  >
                    X
                  </button>
                </div>
              ),
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
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
