import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableItem({ id, content }: { id: string; content: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="icon"
    >
      {content}
    </div>
  );
}

// Empty cell component that can accept drops
function EmptyCell({ id }: { id: string }) {
  return (
    <div 
      className="empty-cell" 
      data-cell-id={id}
    />
  );
}

// Main Grid Component
function DragDropGrid() {
  const totalCells = 60; // 10 columns × 6 rows
  const [items, setItems] = useState<Array<{id: string, content: string}>>(
    Array.from({ length: 1 }, (_, i) => ({
      id: `item-${i + 1}`,
      content: `Item ${i + 1}`
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      // If dropping on an empty cell
      if (over.id.toString().startsWith('empty-')) {
        const targetIndex = parseInt(over.id.toString().split('-')[1]);
        
        setItems((currentItems) => {
          // Remove item from current position
          const itemToMove = currentItems.find(item => item.id === active.id);
          if (!itemToMove) return currentItems;

          const filteredItems = currentItems.filter(item => item.id !== active.id);
          
          // Insert item at new position
          const newItems = [...filteredItems];
          newItems.splice(targetIndex, 0, itemToMove);
          
          return newItems;
        });
      } 
      // If dropping on another item (for when you have multiple items)
      else if (active.id !== over.id) {
        setItems((currentItems) => {
          const oldIndex = currentItems.findIndex(item => item.id === active.id);
          const newIndex = currentItems.findIndex(item => item.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(currentItems, oldIndex, newIndex);
          }
          return currentItems;
        });
      }
    }
  }

  // Create grid cells array with items and empty slots
  const gridCells = Array.from({ length: totalCells }, (_, index) => {
    const item = items[index];
    return item ? { ...item, type: 'item' } : { id: `empty-${index}`, type: 'empty', content: '' };
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="screen_content">
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          {gridCells.map((cell) => (
            cell.type === 'item' ? (
              <SortableItem key={cell.id} id={cell.id} content={cell.content} />
            ) : (
              <EmptyCell key={cell.id} id={cell.id} />
            )
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}

export default DragDropGrid;