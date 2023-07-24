var search = function (nums, target) {
  const lastElement = nums[nums.length - 1];
  if(target === lastElement) return nums.length - 1;
  else if(target === nums[0]) return 0;
  const zeroIndex = nums.length - lastElement - 1;
  console.log(nums[zeroIndex])
  if(target === 0 && nums[zeroIndex] === 0) return zeroIndex;
  let start = 0;
  let end = nums.length - 1;
  if(nums[zeroIndex] === 0){
    if(target < lastElement) start = zeroIndex + 1;
    else end = zeroIndex - 1;
  }
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) start = mid + 1;
    else end = mid - 1;
  }
  return -1;
};

console.log(search([4,5,6,7,8,1,2,3], 8));
