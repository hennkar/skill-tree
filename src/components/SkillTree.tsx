'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
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

const SkillTree: React.FC = () => {
  const [nodes, setNodes] = useState<SkillTreeNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);

  useEffect(() => {
    fetch('/api/neo4j/nodes')
      .then((res) => res.json())
      .then((data) => {
        setNodes(data.nodes);
        setEdges(data.edges);
      });
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
      (connection: Connection) => {
        fetch("/api/neo4j/edges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(connection),
        })
            .then((res) => res.json())
            .then(() => {
              fetch("/api/neo4j/nodes") // Aktualisierte Daten abrufen
                  .then((res) => res.json())
                  .then((data) => {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                  });
            });
      },
      []
  );


  const addNode = useCallback(() => {
    const newNode: SkillTreeNode = {
      id: crypto.randomUUID(),
      position: { x: 200, y: 100 },
      data: { name: `New Node`, level: 1 },
      type: 'default',
    };
    fetch('/api/neo4j/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newNode.id,
        name: newNode.data.name,
        level: newNode.data.level,
      }),
    })
      .then((res) => res.json())
      .then((savedNode) => setNodes((nds) => [...nds, savedNode]));
  }, []);

  const removeNode = useCallback((id: string) => {
    fetch(`/api/neo4j/nodes/${id}`, { method: 'DELETE' }).then(() => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id),
      );
    });
  }, []);

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
        <button
          onClick={() => selectedNode && removeNode(selectedNode.id)}
          className="p-2 bg-red-500 text-white rounded mb-4 ml-2"
        >
          Delete Node
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
