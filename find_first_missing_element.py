def find_first_missing_element(arr, d):
    if not arr:
        return d
    start, end = 0, len(arr) - 1
    while start != end:
        mid = (start + end) // 2
        if arr[mid] == mid + d:
            start = mid + 1
        else:
            end = mid
    return start + d + 1 if start == len(arr) - 1 and arr[start] == start + d else start + d