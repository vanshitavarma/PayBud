import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  setGroups,
  addGroup,
  updateGroup,
  removeGroup,
  setCurrentGroup,
  setGroupsLoading,
  setGroupsError,
} from '@/store/groupsSlice';
import { groupsApi } from '@/api';

export function useGroups() {
  const dispatch = useDispatch();
  const { groups, currentGroup, loading, error } = useSelector((state) => state.groups);

  const fetchGroups = useCallback(async () => {
    try {
      dispatch(setGroupsLoading(true));
      const { data } = await groupsApi.getAll();
      dispatch(setGroups(data.groups));
    } catch (err) {
      dispatch(setGroupsError(err.response?.data?.message || 'Failed to load groups'));
    }
  }, [dispatch]);

  const createGroup = useCallback(async (groupData) => {
    try {
      const { data } = await groupsApi.create(groupData);
      dispatch(addGroup(data.group));
      return data.group;
    } catch (err) {
      dispatch(setGroupsError(err.response?.data?.message || 'Failed to create group'));
      throw err;
    }
  }, [dispatch]);

  const editGroup = useCallback(async (id, groupData) => {
    try {
      const { data } = await groupsApi.update(id, groupData);
      dispatch(updateGroup(data.group));
      return data.group;
    } catch (err) {
      dispatch(setGroupsError(err.response?.data?.message || 'Failed to update group'));
      throw err;
    }
  }, [dispatch]);

  const deleteGroup = useCallback(async (id) => {
    try {
      await groupsApi.delete(id);
      dispatch(removeGroup(id));
    } catch (err) {
      dispatch(setGroupsError(err.response?.data?.message || 'Failed to delete group'));
      throw err;
    }
  }, [dispatch]);

  const selectGroup = useCallback((group) => {
    dispatch(setCurrentGroup(group));
  }, [dispatch]);

  const inviteMember = useCallback(async (groupId, email) => {
    try {
      const { data } = await groupsApi.addMember(groupId, email);
      dispatch(updateGroup(data.group));
      return data.group;
    } catch (err) {
      dispatch(setGroupsError(err.response?.data?.message || 'Failed to add member'));
      throw err;
    }
  }, [dispatch]);

  return {
    groups,
    currentGroup,
    loading,
    error,
    fetchGroups,
    createGroup,
    editGroup,
    deleteGroup,
    selectGroup,
    inviteMember,
  };
}
