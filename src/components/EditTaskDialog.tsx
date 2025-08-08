
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  title: z.string().min(1, '任务标题不能为空'),
  reward_amount: z.number().min(0, '奖励金额必须大于等于0'),
  number_of_orders: z.number().min(0, '订单数量必须大于等于0'),
  open_state: z.boolean(),
  sorting: z.number().min(0, '排序值必须大于等于0'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
}

export const EditTaskDialog = ({ open, onOpenChange, task }: EditTaskDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      reward_amount: task?.reward_amount || 0,
      number_of_orders: task?.number_of_orders || 0,
      open_state: task?.open_state ?? true,
      sorting: task?.sorting || 0,
    },
  });

  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        reward_amount: task.reward_amount,
        number_of_orders: task.number_of_orders,
        open_state: task.open_state,
        sorting: task.sorting,
      });
    }
  }, [task, form]);

  const updateTask = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: data.title,
          reward_amount: data.reward_amount,
          number_of_orders: data.number_of_orders,
          open_state: data.open_state,
          sorting: data.sorting,
        })
        .eq('id', task.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "成功",
        description: "任务已更新",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "错误",
        description: "更新任务失败: " + error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    updateTask.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑任务</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>任务标题</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入任务标题" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reward_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>奖励金额</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="number_of_orders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>订单数量</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sorting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>排序</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="open_state"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">开启状态</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={updateTask.isPending}>
                {updateTask.isPending ? '更新中...' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
