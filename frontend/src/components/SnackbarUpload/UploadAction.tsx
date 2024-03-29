import { Fade, IconButton, ListItemSecondaryAction, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import { Upload } from '../../store/upload/types';
import { useDispatch } from 'react-redux';
import { Creators } from '../../store/upload';
import { hasError, isFinished } from '../../store/upload/getters';
import { useDebounce } from 'use-debounce/lib';

const useStyles = makeStyles((theme: Theme) => ({
    successIcon: {
        color: theme.palette.success.main
    },
    errorIcon: {
        color: theme.palette.error.main
    },
    deleteIcon: {
        color: theme.palette.primary.main
    }
}))

interface UploadActionProps {
    upload: Upload;
    hover: boolean;
}

export const UploadAction: React.FC<UploadActionProps> = (props) => {
    const {upload, hover} = props
    const classes = useStyles()
    const dispatch = useDispatch();
    const error = hasError(upload)
    const [show, setShow] = React.useState(false)
    const [debouncedShow] = useDebounce(show, 2500)

    React.useEffect(() => {
        setShow(isFinished(upload))
    }, [upload])

    return (
        debouncedShow ? (
            <Fade in={show} timeout={{ enter: 1000 }}>
                <ListItemSecondaryAction>
                    <span hidden={hover}>
                        {
                            upload.progress === 1 && !error && (
                                <IconButton className={classes.successIcon} edge={"end"}>
                                    <CheckCircleIcon/>
                                </IconButton>
                            )
                        }
                        {
                            error && (
                                <IconButton className={classes.errorIcon} edge={"end"}>
                                    <ErrorIcon/>
                                </IconButton>
                            )
                        }
                    </span>
                    <span hidden={!hover}>
                        <IconButton className={classes.deleteIcon} edge={"end"} onClick={() => dispatch(Creators.removeUpload({id: upload.video.id}))}>
                            <DeleteIcon/>
                        </IconButton>
                    </span>
                </ListItemSecondaryAction>
            </Fade>
        ) : null

    );
};
