
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, FileText, Upload, User, Video } from "lucide-react";
import { Task } from "./task-list";

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onConfirmComplete: (taskId: string, photoFile?: File) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  open,
  onClose,
  onConfirmComplete,
}) => {
  const [completionPhoto, setCompletionPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompletionPhoto(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (task && completionPhoto) {
      onConfirmComplete(task.id, completionPhoto);
      setCompletionPhoto(null);
      setPhotoPreview(null);
      onClose();
    }
  };

  if (!task) return null;

  const isCompleting = !task.isCompleted;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div>
            <div className="text-sm text-gray-500 mb-1">설명</div>
            <div className="text-sm">{task.description}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div className="text-sm">{task.teacher}</div>
          </div>
          
          {task.resourceUrl && (
            <div className="p-3 border rounded-md">
              {task.resourceType === "link" ? (
                <a 
                  href={task.resourceUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>관련 자료 보기</span>
                </a>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Video className="h-4 w-4" />
                    <span>학습 영상</span>
                  </div>
                  
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-sm text-gray-500">영상 플레이어</div>
                  </div>
                  
                  {task.videoWatchTime && (
                    <div className="text-xs text-gray-500">
                      시청 시간: {task.videoWatchTime}분
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <Separator />
        
        {isCompleting ? (
          <div className="space-y-3">
            <Label htmlFor="completion-photo">인증 사진 업로드</Label>
            <div className="grid w-full items-center gap-1.5">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Completion" 
                    className="w-full h-auto rounded-md" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPhotoPreview(null);
                      setCompletionPhoto(null);
                    }}
                    className="absolute top-1 right-1 h-8 w-8 p-1 rounded-full bg-black/30 text-white"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="completion-photo"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span>사진 클릭 또는 드래그</span>
                      </p>
                    </div>
                    <input
                      id="completion-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-green-600 font-medium">완료된 할일입니다.</div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          {isCompleting && (
            <Button 
              onClick={handleConfirm} 
              disabled={!completionPhoto}
            >
              확인
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
